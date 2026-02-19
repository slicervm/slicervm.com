#!/usr/bin/env bash

if [ -n "$DEBUG" ] ; then
    set -e -x -o pipefail
else
    set -e -o pipefail
fi

# Run this installer at your own risk, no warranty implied or given.

# Parse command line arguments
INSTALL_DEVMAPPER=false
INSTALL_ZVOL=false
ZFS_DEV=""
DEVMAPPER_DEV=""
OVERWRITE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --devmapper)
            INSTALL_DEVMAPPER=true
            if [[ -n "$2" && "$2" != --* ]]; then
                DEVMAPPER_DEV="$2"
                shift 2
            else
                shift
            fi
            ;;
        --zfs)
            INSTALL_ZVOL=true
            if [[ -n "$2" && "$2" != --* ]]; then
                ZFS_DEV="$2"
                shift 2
            else
                shift
            fi
            ;;
        --overwrite)
            OVERWRITE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --devmapper [DEVICE]  Install devmapper storage backend"
            echo "                        Optionally specify block device (e.g. /dev/sdc1)"
            echo "  --zfs [DEVICE]        Install ZFS zvol storage backend"
            echo "                        Optionally specify block device (e.g. /dev/sdb1)"
            echo "  --overwrite           Overwrite existing disk"
            echo "  --help, -h            Show this help message"
            echo ""
            echo "Examples:"
            echo "  $0                           # Install Slicer"
            echo "  $0 --devmapper               # Install with devmapper storage (loop device)"
            echo "  $0 --devmapper /dev/sdb      # Install devmapper with block device"
            echo "  $0 --zfs                     # Install with ZFS zvol storage (loop device)"
            echo "  $0 --zfs /dev/sdc            # Install ZFS with block device"
            echo "  $0 --devmapper --zfs         # Install with both storage backends"
            echo "  $0 --zfs /dev/sdb1 --overwrite  # Overwrite existing disks"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

if [ "$OSTYPE" = "linux-gnu" ] && [ "$(id -u)" -ne 0 ]; then
    echo "The installation must be run as sudo or root"
    exit 1
fi

echo "Downloading and installing Slicer..."

# Install arkade
if ! [ -e /usr/local/bin/arkade ]; then
    curl -sLS https://get.arkade.dev | sh
fi

# Use arkade to install Slicer from its OCI container image
if ! command -v arkade >/dev/null 2>&1; then
    export PATH="/usr/local/bin:$PATH"
fi

/usr/local/bin/arkade oci install ghcr.io/openfaasltd/slicer:latest \
  --path /usr/local/bin

if [ "$OSTYPE" != "linux-gnu" ]; then
  echo ""
  echo "Slicer client.. Installed OK."
  echo "Slicer server skipped (only supported on Linux)."
  echo ""
  echo "Find out more at https://slicervm.com"
  echo ""
  exit 0
fi

# If we're on Linux, perform an installation of server-side
# components.
export CNI_VERSION="v1.8.0"
export CONTAINERD_VERSION="1.7.25"
export ARCH=$(uname -p)
export FIRECRACKER_VER="1.14.0"
export TC_TAP_VERSION="2024-02-14-1230"
export DEBIAN_FRONTEND=noninteractive

detect_os() {
    if [ -f /etc/os-release ]; then
        # shellcheck disable=SC1091
        . /etc/os-release
        OS_ID="${ID:-}"
        OS_LIKE="${ID_LIKE:-}"
    else
        OS_ID=""
        OS_LIKE=""
    fi

    if command -v apt-get >/dev/null 2>&1; then
        PKG_MGR="apt"
    elif command -v dnf >/dev/null 2>&1; then
        PKG_MGR="dnf"
    elif command -v yum >/dev/null 2>&1; then
        PKG_MGR="yum"
    elif command -v pacman >/dev/null 2>&1; then
        PKG_MGR="pacman"
    else
        PKG_MGR=""
    fi
}

is_rhel_like() {
    case "$OS_ID" in
        rhel|rocky|almalinux|centos|ol|cloudlinux)
            return 0
            ;;
    esac

    case "$OS_LIKE" in
        *rhel*|*fedora*)
            return 0
            ;;
    esac

    return 1
}

install_os_packages() {
    local packages=("$@")
    if [ ${#packages[@]} -eq 0 ]; then
        return 0
    fi

    case "$PKG_MGR" in
        apt)
            apt update -qy
            apt install -qy --no-install-recommends "${packages[@]}"
            ;;
        dnf)
            dnf -y --setopt=install_weak_deps=False install "${packages[@]}"
            ;;
        yum)
            yum -y --setopt=install_weak_deps=False install "${packages[@]}"
            ;;
        pacman)
            pacman -Sy --noconfirm "${packages[@]}"
            ;;
        *)
            echo "Error: No supported package manager found."
            exit 1
            ;;
    esac
}

install_core_packages() {
    echo "Installing required OS packages"

    case "$PKG_MGR" in
        apt)
            install_os_packages \
                runc \
                rsync \
                e2fsprogs \
                e2fsck-static \
                bridge-utils \
                iptables \
                pciutils
            ;;
        dnf|yum)
            if is_rhel_like; then
                local rhel_version
                rhel_version=$(rpm --eval "%{rhel}" 2>/dev/null || true)
                if [ -n "$rhel_version" ] && [ "$rhel_version" -ge 8 ]; then
                    install_os_packages \
                        runc \
                        rsync \
                        e2fsprogs \
                        iproute \
                        iptables \
                        pciutils
                else
                    install_os_packages \
                        runc \
                        rsync \
                        e2fsprogs \
                        bridge-utils \
                        iptables \
                        pciutils
                fi
            else
                install_os_packages \
                    runc \
                    rsync \
                    e2fsprogs \
                    bridge-utils \
                    iptables \
                    pciutils
            fi
            ;;
        pacman)
            local arch_packages=(runc rsync e2fsprogs iproute2 pciutils)
            # Only install iptables-nft if neither iptables variant is installed
            if ! pacman -Q iptables-nft >/dev/null 2>&1 && ! pacman -Q iptables >/dev/null 2>&1; then
                arch_packages+=(iptables-nft)
            fi
            install_os_packages "${arch_packages[@]}"
            ;;
        *)
            echo "Error: unsupported Linux distribution"
            exit 1
            ;;
    esac
}

install_devmapper_packages() {
    case "$PKG_MGR" in
        apt)
            install_os_packages lvm2 dmsetup bc
            ;;
        dnf|yum)
            if is_rhel_like; then
                install_os_packages lvm2 device-mapper bc
            else
                install_os_packages lvm2 dmsetup bc
            fi
            ;;
        pacman)
            install_os_packages lvm2 device-mapper bc
            ;;
        *)
            echo "Error: unsupported Linux distribution"
            exit 1
            ;;
    esac
}

install_zfs_packages() {
    if modprobe zfs >/dev/null 2>&1 && command -v zfs >/dev/null 2>&1; then
        return
    fi

    if [ "$OS_ID" = "ubuntu" ]; then
        install_os_packages zfsutils-linux
        if modprobe zfs >/dev/null 2>&1 && command -v zfs >/dev/null 2>&1; then
            return
        fi
    fi

    echo "Error: ZFS is not available on this host."
    echo "Please install OpenZFS for your distribution and re-run the installer."
    echo "See: https://openzfs.github.io/openzfs-docs/Getting%20Started/index.html"
    exit 1
}

validate_device() {
    local device="$1"
    local device_type="$2"

    if [[ -z "$device" ]]; then
        return 0  # Empty device is valid (will use loop device)
    fi

    echo "Validating $device_type device: $device"

    # Check if device exists
    if [[ ! -e "$device" ]]; then
        echo "Error: Device '$device' does not exist"
        return 1
    fi

    # Check if it's a block device
    if [[ ! -b "$device" ]]; then
        echo "Error: '$device' is not a block device"
        return 1
    fi

    # Check if device is already mounted
    if mount | grep -q "^$device "; then
        echo "Error: Device '$device' is currently mounted"
        echo "Please unmount it before using for $device_type storage"
        return 1
    fi

    echo "Device $device validated successfully"
    return 0
}

confirm_device_overwrite() {
    local device="$1"
    local device_type="$2"

    if [[ -z "$device" ]]; then
        return 0  # No device to confirm
    fi

    local needs_confirmation=false

    # Check if device is part of existing LVM setup or has filesystem
    if command -v pvdisplay >/dev/null 2>&1 && pvdisplay "$device" >/dev/null 2>&1; then
        needs_confirmation=true
    elif command -v blkid >/dev/null 2>&1 && blkid "$device" >/dev/null 2>&1; then
        needs_confirmation=true
    fi

    # Check if device has existing data and --overwrite not specified
    if [[ "$needs_confirmation" = true ]] && [[ "$OVERWRITE" != true ]]; then
        echo "Error: Device '$device' contains existing data."
        echo "Use --overwrite to destroy existing data and proceed with $device_type installation."
        exit 1
    elif [[ "$needs_confirmation" = true ]]; then
        echo "Warning: Device '$device' contains existing data. Overwriting due to --overwrite flag."
    fi

    return 0
}

check_kvm() {
    if ! [ -e /dev/kvm ]; then
        echo "Error: KVM not found. Is virtualisation available? Try running:"
        echo "sudo modprobe kvm"
        exit 1
    fi

    # If /proc/modules contains the text "kvm_pvm", return early skipping the kvm-ok check
    # kvm-ok doesn't yet support checking for the PVM type of KVM
    if grep -q "kvm_pvm" /proc/modules; then
        echo "PVM KVM found"
        return
    fi

    if [ "$PKG_MGR" = "apt" ]; then
        if ! command -v kvm-ok &> /dev/null; then
            echo "Installing kvm-ok to check for KVM support"
            apt update && apt install -qy \
            --no-install-recommends \
                cpu-checker
        fi
        kvm-ok
    fi
}

install_cni() {
    echo "Installing CNI plugins"

    if ! [ -e  /opt/cni/bin/firewall ]; then
        arkade system install cni --version ${CNI_VERSION} --path /opt/cni/bin --progress=false

        # Make a config folder for CNI definitions
        mkdir -p /etc/cni/net.d

        # Make an initial loopback configuration
        sh -c 'cat >/etc/cni/net.d/99-loopback.conf<<EOF
{
    "cniVersion": "0.3.1",
    "type": "loopback"
}

EOF'

    fi

    if ! [ -e   /etc/cni/net.d/50-mvm.conflist ]; then
        cat <<EOF > /etc/cni/net.d/50-mvm.conflist
{
    "name": "mvm",
    "cniVersion": "1.0.0",
    "plugins": [
        {
            "type": "bridge",
            "bridge": "mvm-br",
            "isDefaultGateway": true,
            "forceAddress": false,
            "ipMasq": true,
            "hairpinMode": true,
            "mtu": 1500,
            "ipam": {
                "type": "host-local",
                "subnet": "192.168.128.0/24",
                "resolvConf": "/etc/resolv.conf",
                "dataDir": "/var/run/cni"
            }
        },
        {
            "type": "firewall"
        },
        {
            "type": "tc-redirect-tap"
        }
    ]
}
EOF
    fi
}

update_containerd_devmapper_config() {
    local pool_name="$1"
    local base_size="$2"
    local root_path="${DATA_DIR:-/var/lib/containerd/devmapper}"

    local containerd_cfg="/etc/containerd/config.toml"
    local tmp_removed="${containerd_cfg}.tmp"
    local tmp_new="${containerd_cfg}.new"

    if [[ -z "$pool_name" ]]; then
        echo "Error: pool_name is required"
        return 1
    fi

    base_size="${base_size:-25GB}"

    echo "Updating containerd devmapper config:"
    echo "  pool_name: ${pool_name}"
    echo "  base_image_size: ${base_size}"
    echo "  root_path: ${root_path}"

    mkdir -p "$(dirname "$containerd_cfg")"

    local devmapper_block
    devmapper_block=$(cat <<EOF
  [plugins.devmapper]
    pool_name = "${pool_name}"
    root_path = "${root_path}"
    base_image_size = "${base_size}"
    discard_blocks = true
EOF
)

    if [[ -f "$containerd_cfg" ]]; then
        awk '
            BEGIN { skip = 0 }
            /^[[:space:]]*\[plugins\.devmapper\]$/ { skip = 1; next }
            /^[[:space:]]*\[plugins\."io\.containerd\.snapshotter\.v1\.devmapper"\]$/ { skip = 1; next }
            /^[[:space:]]*\[/ { if (skip) { skip = 0 } }
            !skip { print }
        ' "$containerd_cfg" > "$tmp_removed"
    else
        : > "$tmp_removed"
    fi

    if grep -q '^[[:space:]]*\[plugins\][[:space:]]*$' "$tmp_removed"; then
        awk -v block="$devmapper_block" '
            { print }
            !inserted && $0 ~ /^[[:space:]]*\[plugins\][[:space:]]*$/ {
                print block
                inserted = 1
            }
        ' "$tmp_removed" > "$tmp_new"
    else
        cp "$tmp_removed" "$tmp_new"
        if [[ -s "$tmp_new" ]] && tail -n 1 "$tmp_new" | grep -q '[^[:space:]]'; then
            printf '\n' >> "$tmp_new"
        fi
        cat <<EOF >> "$tmp_new"
[plugins]
$devmapper_block
EOF
    fi

    mv "$tmp_new" "$containerd_cfg"
    rm -f "$tmp_removed"

    return 0
}

install_devmapper() {
    local pool_name="$1"
    local vm_dev="$2"
    local base_size="$3"

    if [[ -z "$pool_name" ]]; then
        echo "Error: pool_name parameter is required"
        return 1
    fi

    if [[ -z "$base_size" ]]; then
        echo "Error: base_size parameter is required"
        return 1
    fi

    # Ensure state directory for devmapper plugin exists
    mkdir -p /var/lib/containerd/devmapper

    if [ -e /dev/mapper/${pool_name}-thinpool ]; then
        echo "Pool '$pool_name' exists."
    else
        if [ -n "$vm_dev" ] ; then
            # Create a thin pool within the specified device
            echo "Creating VM pool on $vm_dev"

            # Confirm device overwrite before destructive operation
            confirm_device_overwrite "$vm_dev" "devmapper"

            # LVM setup
            pvcreate -ff -y "$vm_dev"
            vgcreate "$pool_name" "$vm_dev"

            lvcreate -q --wipesignatures y -n thinpool "$pool_name" -l 95%VG
            lvcreate -q --wipesignatures y -n thinpoolmeta "$pool_name" -l 1%VG

            lvconvert -y --zero n -c 512K \
                --thinpool "${pool_name}/thinpool" \
                --poolmetadata "${pool_name}/thinpoolmeta"

            # LVM auto-extend profile
            mkdir -p /etc/lvm/profile
            cat > "/etc/lvm/profile/${pool_name}-thinpool.profile" <<EOF
activation {
    thin_pool_autoextend_threshold=80
    thin_pool_autoextend_percent=20
}
EOF

            lvchange -q -y --metadataprofile "${pool_name}-thinpool" "${pool_name}/thinpool"
            lvchange --monitor y "${pool_name}/thinpool"
        else
            # Create a loopback-based thin pool if no device specified
            data_dir=/var/lib/containerd/devmapper

            mkdir -p ${data_dir}

            # Create data file
            touch "${data_dir}/data"
            truncate -s 200G "${data_dir}/data"

            # Create metadata file
            touch "${data_dir}/meta"
            truncate -s 20G "${data_dir}/meta"

            # Allocate loop devices
            data_dev=$(losetup --find --show "${data_dir}/data")
            meta_dev=$(losetup --find --show "${data_dir}/meta")

            # Define thin-pool parameters.
            # See https://www.kernel.org/doc/Documentation/device-mapper/thin-provisioning.txt for details.
            sector_size=512
            data_size="$(blockdev --getsize64 -q ${data_dev})"
            length_in_sectors=$(bc <<< "${data_size}/${sector_size}")
            data_block_size=128
            low_water_mark=32768

            # Create a thin-pool device
            dmsetup create "${pool_name}-thinpool" \
                --table "0 ${length_in_sectors} thin-pool ${meta_dev} ${data_dev} ${data_block_size} ${low_water_mark}"
        fi
    fi

    update_containerd_devmapper_config \
        "${pool_name}-thinpool" \
        "$base_size"

    if systemctl is-active --quiet containerd; then
        echo "Restarting containerd to load devmapper snapshotter"
        systemctl restart containerd
    fi
}

zpool_exists() {
    local pool_name="$1"
    zpool list -H -o name | grep -q "^${pool_name}$"
}

update_containerd_zvol_config() {
    local containerd_cfg="/etc/containerd/config.toml"
    local zvol_socket="/run/containerd-zvol-grpc/containerd-zvol-grpc.sock"
    local tmp_removed="${containerd_cfg}.tmp"
    local tmp_new="${containerd_cfg}.new"

    echo "Updating containerd zvol config:"
    echo "  address: ${zvol_socket}"

    mkdir -p "$(dirname "$containerd_cfg")"

    local zvol_block
    zvol_block=$(cat <<EOF
  [proxy_plugins.zvol]
    type = "snapshot"
    address = "${zvol_socket}"
EOF
)

    if [[ -f "$containerd_cfg" ]]; then
        awk '
            BEGIN { skip = 0 }
            /^[[:space:]]*\[proxy_plugins\.zvol\]$/ { skip = 1; next }
            /^[[:space:]]*\[/ { if (skip) { skip = 0 } }
            !skip { print }
        ' "$containerd_cfg" > "$tmp_removed"
    else
        : > "$tmp_removed"
    fi

    if grep -q '^[[:space:]]*\[proxy_plugins\][[:space:]]*$' "$tmp_removed"; then
        awk -v block="$zvol_block" '
            { print }
            !inserted && $0 ~ /^[[:space:]]*\[proxy_plugins\][[:space:]]*$/ {
                print block
                inserted = 1
            }
        ' "$tmp_removed" > "$tmp_new"
    else
        cp "$tmp_removed" "$tmp_new"
        if [[ -s "$tmp_new" ]] && tail -n 1 "$tmp_new" | grep -q '[^[:space:]]'; then
            printf '\n' >> "$tmp_new"
        fi
        cat <<EOF >> "$tmp_new"
[proxy_plugins]
$zvol_block
EOF
    fi

    mv "$tmp_new" "$containerd_cfg"
    rm -f "$tmp_removed"

    echo "Added zvol plugin configuration to containerd"
}

install_zvol_snapshotter() {
    local zpool="$1"
    local zfs_dataset="$2"
    local vm_dev="$3"
    local base_size="$4"

    if [[ -z "$zpool" ]]; then
        echo "Error: zpool parameter is required"
        return 1
    fi

    if [[ -z "$zfs_dataset" ]]; then
        echo "Error: zfs_dataset parameter is required"
        return 1
    fi

    if [[ -z "$base_size" ]]; then
        echo "Error: base_size parameter is required"
        return 1
    fi

    # Check if zpool exists, create if necessary
    if zpool_exists "$zpool"; then
        echo "Zpool '$zpool' exists."
    else
        # Create a loopback device if vm_dev not set and use it as device for the zpool.
        if [ -z "$vm_dev" ]; then
            data_dir=/var/lib/containerd-zvol-grpc/data
            mkdir -p $data_dir

            zdev="${data_dir}/slicer-zdev"
            echo "Creating loopback device for ZFS: $zdev"

            truncate -s 200G $zdev
            vm_dev="$zdev"
        fi

        echo "Creating zpool '$zpool' on device '$vm_dev'..."

        # Confirm device overwrite before destructive operation
        confirm_device_overwrite "$vm_dev" "ZFS"

        # Create the zpool using the specified device
        if zpool create -m none -f "$zpool" "$vm_dev"; then
            echo "Successfully created zpool '$zpool'."
        else
            # Print an error if creation failed and exit the script entirely
            echo "Error: Failed to create zpool '$zpool' on '$vm_dev'." >&2
            exit 1
        fi
    fi

    # Create ZFS dataset if it doesn't exist
    if ! zfs list -H -o name | grep -q "^$zfs_dataset$"; then
        echo "Creating ZFS dataset '$zfs_dataset'..."

        if zfs create "$zfs_dataset" \
                   -o mountpoint=none \
                   -o compression=lz4 \
                   -o atime=off \
                   -o relatime=on \
                   -o sync=disabled \
                   -o recordsize=1M \
                   -o primarycache=all \
                   -o secondarycache=all \
                   -o logbias=throughput \
                   -o redundant_metadata=most; then
            echo "Successfully created dataset '$zfs_dataset'."
        else
            # Print an error if creation failed (e.g., if the ZPOOL doesn't exist)
            echo "Error: Failed to create dataset '$zfs_dataset'." >&2
            exit 1
        fi
    else
        echo "ZFS dataset '$zfs_dataset' exists"
    fi

    # Check if zvol snapshotter plugin is registered with containerd
    if ! ctr plugin list | awk '$1=="io.containerd.snapshotter.v1" && $2=="zvol" && $NF=="ok" { found=1 } END { exit found ? 0 : 1 }'; then
        echo "Zvol snapshotter plugin not registered, configuring..."

        # Install binary if not present
        if ! [ -e /usr/local/bin/containerd-zvol-grpc ]; then
            echo "Installing zvol-snapshotter"

            arkade system install zvol-snapshotter --dataset $zfs_dataset --size $base_size --systemd
        else
            echo "Zvol snapshotter binary already installed"
        fi

        # Configure containerd for zvol snapshotter
        update_containerd_zvol_config

        if systemctl is-active --quiet containerd; then
            echo "Restarting containerd to load zvol plugin"
            systemctl restart containerd
        fi
    fi
}

install_tctap() {
    if ! [ -e  /opt/cni/bin/tc-redirect-tap ]; then
        arkade system install tc-redirect-tap --version ${TC_TAP_VERSION} --path /opt/cni/bin --progress=false
    fi
}

install_containerd() {
    echo "Installing containerd"

    if ! [ -e /usr/local/bin/containerd ]; then
        arkade system install containerd --version v${CONTAINERD_VERSION} --systemd=true --progress=false
    else
     echo "Found containerd version $(containerd -version)"
    fi
}

install_fwd() {
    cat <<'EOF' | sudo tee /etc/sysctl.d/99-slicer.conf
net.ipv4.ip_forward = 1
net.ipv4.conf.all.forwarding = 1
EOF

    sudo sysctl --system
    sudo sysctl net.ipv4.ip_forward
}

configure_network_management() {
    echo "Configuring network management for Slicer isolated networking"

    # Check if NetworkManager is active
    if systemctl is-active --quiet NetworkManager; then
        echo "NetworkManager detected - no additional configuration needed"
        return 0
    fi

    # Check if systemd-networkd is active (common on Ubuntu Server)
    if systemctl is-active --quiet systemd-networkd; then
        echo "systemd-networkd detected - configuring veth interface exclusion"

        # Configure systemd-networkd to ignore veth interfaces
        if ! [ -f /etc/systemd/network/00-veth-ignore.network ]; then
            cat <<EOF > /etc/systemd/network/00-veth-ignore.network
[Match]
Name=ve-* veth*
Driver=veth

[Link]
Unmanaged=yes

[Network]
KeepConfiguration=yes
EOF
            echo "Created veth interface exclusion rule"
        else
            echo "Veth interface exclusion rule already exists"
        fi

        # Update systemd-networkd configuration
        local networkd_conf="/etc/systemd/networkd.conf"
        if ! grep -q "KeepConfiguration=yes" "$networkd_conf" 2>/dev/null; then
            cat <<EOF > "$networkd_conf"
[Network]
KeepConfiguration=yes
ManageForeignRoutes=no
#SpeedMeter=no
#SpeedMeterIntervalSec=10sec
#ManageForeignRoutingPolicyRules=yes
#ManageForeignRoutes=yes
#RouteTable=
#IPv6PrivacyExtensions=no

[DHCPv4]
#DUIDType=vendor
#DUIDRawData=

[DHCPv6]
#DUIDType=vendor
#DUIDRawData=
EOF
            echo "Updated systemd-networkd configuration"

            # Restart systemd-networkd to apply changes
            systemctl restart systemd-networkd
            echo "Restarted systemd-networkd"
        else
            echo "systemd-networkd configuration already optimized"
        fi
    else
        echo "No known network manager detected - manual configuration may be required"
    fi
}

install_firecracker() {
    if ! [ -e /usr/local/bin/firecracker ] ; then

        # Install forked/patched Firecracker when PVM is found
        if grep -q "kvm_pvm" /proc/modules; then
            echo "Installing forked firecracker with PVM support"
            curl -o /tmp/firecracker -S -L -s https://github.com/loopholelabs/firecracker/releases/download/release-main-live-migration-pvm/firecracker.linux-x86_64
            chmod +x /tmp/firecracker
            sudo mv /tmp/firecracker /usr/local/bin/firecracker
        else
            echo "Installing firecracker"
            arkade system install firecracker --version v${FIRECRACKER_VER} --path /usr/local/bin --progress=false
        fi
    else
        echo "Firecracker already present"
    fi

    /usr/local/bin/firecracker --version | head -n1
}

install_cloudhypervisor() {
    if ! [ -e /usr/local/bin/cloud-hypervisor ]; then
        echo "Installing cloud-hypervisor"

        # Unlike with firecracker, the version of cloud-hypervisor is not pinned.
        arkade get cloud-hypervisor
        chmod +x $HOME/.arkade/bin/cloud-hypervisor
        sudo mv $HOME/.arkade/bin/cloud-hypervisor /usr/local/bin/
    else
        echo "cloud-hypervisor already present"
    fi
}

# Validation checks
detect_os
check_kvm

# Core dependencies
install_core_packages
install_cni
install_tctap
install_containerd
install_fwd
configure_network_management

# Storage backends
if [ "$INSTALL_DEVMAPPER" = true ]; then
    echo "Installing devmapper storage backend..."
    install_devmapper_packages

    # Validate devmapper device if specified
    if ! validate_device "$DEVMAPPER_DEV" "devmapper"; then
        echo "Device validation failed for devmapper"
        exit 1
    fi

    # Set defaults for devmapper if not already set
    export POOL_NAME="${POOL_NAME:-slicer}"
    export BASE_SIZE="${BASE_SIZE:-30GB}"
    install_devmapper "$POOL_NAME" "$DEVMAPPER_DEV" "$BASE_SIZE"
fi

if [ "$INSTALL_ZVOL" = true ]; then
    echo "Installing ZFS zvol snapshotter storage backend..."
    install_zfs_packages

    # Validate ZFS device if specified
    if ! validate_device "$ZFS_DEV" "ZFS"; then
        echo "Device validation failed for ZFS"
        exit 1
    fi

    # Set defaults for ZFS if not already set
    export ZPOOL="${ZPOOL:-slicer_zpool}"
    export ZFS_DATASET="${ZFS_DATASET:-${ZPOOL}/snapshots}"
    export BASE_SIZE="${BASE_SIZE:-30GB}"
    install_zvol_snapshotter "$ZPOOL" "$ZFS_DATASET" "$ZFS_DEV" "$BASE_SIZE"
fi

# Hypervisors
install_firecracker
install_cloudhypervisor

echo "Slicer for Linux requires a license"
echo ""
echo "Individual tier, run: \"slicer activate\" to complete the setup"
echo ""
echo "Team/Platform tier, paste your license key into ~/.slicer/LICENSE from Order confirmation"
echo ""
echo "Find out more at https://slicervm.com"
echo ""

exit 0
