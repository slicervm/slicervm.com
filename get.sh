#!/bin/bash

set -e

# Run this installer at your own risk, no warranty implied or given.

echo "Downloading and installing Slicer..."

# Install arkade
curl -sLS https://get.arkade.dev | sudo sh

# Use arkade to install Slicer from its OCI container image
sudo -E arkade oci install ghcr.io/openfaasltd/slicer:latest \
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
# components using actuated's installer
(

# The installer usually looks for an actuated license, but you don't
# need one to run the installation. We'll create a temporary file via touch.
mkdir -p ~/.actuated
touch ~/.actuated/LICENSE

# Use arkade to extract the agent from its OCI container image
arkade oci install ghcr.io/openfaasltd/actuated-agent:latest --path ./agent
chmod +x ./agent/agent*
sudo mv ./agent/agent* /usr/local/bin/
)

(
cd agent
sudo -E ./install.sh | grep -v actuated | grep -v Actuated | grep -v team
)

echo ""
echo "Home Edition users, run: \"slicer activate\" to complete the setup"
echo ""
echo "Commercial users, paste your license key into ~/.slicer/LICENSE"
echo ""
echo "Find out more at https://slicervm.com"
echo ""

exit 0