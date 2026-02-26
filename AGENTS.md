# AGENTS.md

<instructions>

## Testing the get.sh install script.

This document explains how to test the Slicer install script (`get.sh`) on Digital Ocean droplets.

### Prerequisites

- `doctl` CLI installed and authenticated: https://docs.digitalocean.com/reference/doctl/
- SSH key added to your DO account (get key ID with `doctl compute ssh-key list`)
- Slicer license key available at `~/.slicer/LICENSE`

### Supported Distributions

Test on these distributions:

- Ubuntu 24.04 (ubuntu-24-04-x64) - supports both --devmapper and --zfs
- Debian 12 (debian-12-x64)
- Fedora 42 (fedora-42-x64)
- AlmaLinux 9 (almalinux-9-x64)
- Rocky Linux 8, 9, 10 (rockylinux-8-x64, rockylinux-9-x64, rockylinux-10-x64)
- Arch Linux (requires custom image)

### Create Test Droplets

```bash
# Set your SSH key ID and region
SSH_KEY_ID=$(doctl compute ssh-key list --format ID --no-header | head -1)
REGION="fra1"  # Change to a region near you (list with: doctl compute region list)

# Create droplets for each distribution
doctl compute droplet create slicer-test-ubuntu \
  --image ubuntu-24-04-x64 \
  --size s-2vcpu-4gb \
  --region "$REGION" \
  --ssh-keys "$SSH_KEY_ID" \
  --wait

doctl compute droplet create slicer-test-debian \
  --image debian-12-x64 \
  --size s-2vcpu-4gb \
  --region "$REGION" \
  --ssh-keys "$SSH_KEY_ID" \
  --wait

doctl compute droplet create slicer-test-fedora \
  --image fedora-42-x64 \
  --size s-2vcpu-4gb \
  --region "$REGION" \
  --ssh-keys "$SSH_KEY_ID" \
  --wait

doctl compute droplet create slicer-test-alma \
  --image almalinux-9-x64 \
  --size s-2vcpu-4gb \
  --region "$REGION" \
  --ssh-keys "$SSH_KEY_ID" \
  --wait

doctl compute droplet create slicer-test-rocky9 \
  --image rockylinux-9-x64 \
  --size s-2vcpu-4gb \
  --region "$REGION" \
  --ssh-keys "$SSH_KEY_ID" \
  --wait
```

### Get Droplet IPs

```bash
doctl compute droplet list --format Name,PublicIPv4
```

### Run Tests

For each droplet, SSH in and run the install script:

```bash
# Get droplet IP
DROPLET_IP=$(doctl compute droplet get slicer-test-ubuntu --format PublicIPv4 --no-header)

# SSH options to skip host key verification (safe for ephemeral test droplets)
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"

# Copy license key to droplet
ssh $SSH_OPTS root@$DROPLET_IP "mkdir -p ~/.slicer"
scp $SSH_OPTS ~/.slicer/LICENSE root@$DROPLET_IP:~/.slicer/LICENSE

# Copy the local install script to droplet
scp $SSH_OPTS get.sh root@$DROPLET_IP:~/get.sh

# SSH into droplet
ssh $SSH_OPTS root@$DROPLET_IP
```

**Note:** SSH may not be ready immediately after droplet creation. Use a retry loop:

```bash
# Wait for SSH to be ready (up to 2 minutes)
for i in {1..12}; do
  if ssh $SSH_OPTS root@$DROPLET_IP "echo 'SSH ready'" 2>/dev/null; then
    break
  fi
  echo "Attempt $i: waiting for SSH..."
  sleep 10
done
```

#### Test --devmapper (all distributions)

```bash
# Install with devmapper backend
sudo bash ~/get.sh --devmapper

# Check devmapper plugin status
ctr plugin ls | grep devmapper

# Test VM creation with image storage (default)
# Note: `slicer new` outputs YAML to stdout, redirect to file
slicer new test-image > test-image.yaml
slicer up ./test-image.yaml

# List running VMs
slicer vm ls

# Test connectivity inside VM (use `slicer vm exec` for commands)
slicer vm exec test-image-1 'ping -c 3 8.8.8.8'
slicer vm exec test-image-1 'curl -s -I https://google.com | head -5'

# Shutdown and delete VM
# Note: `slicer vm shutdown` may return EOF error but still stops the VM
slicer vm shutdown test-image-1
slicer vm delete test-image-1

# Test VM creation with devmapper storage
slicer new test-dm --storage devmapper > test-dm.yaml
slicer up ./test-dm.yaml
slicer vm shutdown test-dm-1
slicer vm delete test-dm-1
```

#### Test --zfs (Ubuntu only)

```bash
# Install with ZFS backend
sudo bash ~/get.sh --zfs

# Check zvol plugin status
ctr plugin list | grep zvol

# Test VM creation with ZFS storage
slicer new test-zfs --storage zvol > test-zfs.yaml
slicer up ./test-zfs.yaml
slicer vm shutdown test-zfs-1
slicer vm delete test-zfs-1
```

#### Test both backends (Ubuntu)

```bash
sudo bash ~/get.sh --devmapper --zfs

# Verify both plugins
ctr plugin list | grep -E "(devmapper|zvol)"
```

### Reset Droplets (Optional)

When iterating on the install script, you can reset droplets to their original image instead of destroying and recreating them:

```bash
# Reset a single droplet to its original image
doctl compute droplet-action rebuild slicer-test-ubuntu --image ubuntu-24-04-x64 --wait

# Reset all test droplets
doctl compute droplet-action rebuild slicer-test-debian --image debian-12-x64 --wait
doctl compute droplet-action rebuild slicer-test-fedora --image fedora-42-x64 --wait
doctl compute droplet-action rebuild slicer-test-alma --image almalinux-9-x64 --wait
doctl compute droplet-action rebuild slicer-test-rocky9 --image rockylinux-9-x64 --wait
```

Note: After rebuilding, you'll need to re-copy the license key and install script.

### Cleanup

Delete all test droplets after testing:

```bash
# Delete individual droplets
doctl compute droplet delete slicer-test-ubuntu --force
doctl compute droplet delete slicer-test-debian --force
doctl compute droplet delete slicer-test-fedora --force
doctl compute droplet delete slicer-test-alma --force
doctl compute droplet delete slicer-test-rocky9 --force

# Or delete all droplets matching pattern
doctl compute droplet list --format ID,Name --no-header | grep slicer-test | awk '{print $1}' | xargs -I {} doctl compute droplet delete {} --force
```

### Verification Checklist

For each distribution, verify:

- [ ] Install script completes without errors
- [ ] `ctr plugin list` shows devmapper plugin with status "ok"
- [ ] `ctr plugin list` shows zvol plugin with status "ok" (Ubuntu only)
- [ ] `slicer new` creates a VM successfully
- [ ] `slicer up` starts the VM
- [ ] `slicer vm shutdown` stops the VM
- [ ] `slicer vm delete` removes the VM
- [ ] VM works with image storage (default)
- [ ] VM works with devmapper storage (`--storage devmapper`)
- [ ] VM works with ZFS storage (`--storage zfs`) - Ubuntu only

## Website development

- Do NOT run `npm run build` or `npm run dist` to verify changes. The user runs their own `npm run dev` server.
