---
title: "Testing for the nodes/proxy RCE vulnerability with K3s"
date: "2026-01-27T12:00:00Z"
excerpt: "We spin up a K3s cluster in a Slicer microVM and run Graham Helton's detection script to check for the nodes/proxy RCE vulnerability."
author: "Alex Ellis"
tags:
  - "kubernetes"
  - "security"
  - "slicer"
---

Security researcher Graham Helton recently disclosed an interesting Kubernetes RBAC behavior: [nodes/proxy GET permissions allow command execution in any Pod](https://grahamhelton.com/blog/nodes-proxy-rce). The Kubernetes Security Team closed this as "working as intended," but it's worth understanding the implications.

Did you know? We are the team behind [OpenFaaS](https://openfaas.com) - Serverless Functions for Kubernetes. We've already written up a [separate blog post](https://www.openfaas.com/blog/kubernetes-node-proxy-rce/) exploring the potential impact of this vulnerability for OpenFaaS users.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Excited to disclose my research allowing RCE in Kubernetes<br/><br/>It allows running arbitrary commands in EVERY pod in a cluster using a commonly granted &quot;read only&quot; RBAC permission. This is not logged and and allows for trivial Pod breakout.<br/><br/>Unfortunately, this will NOT be patched. <a href="https://t.co/MQky20uamu">pic.twitter.com/MQky20uamu</a></p>&mdash; Graham Helton (too much for zblock) (@GrahamHelton3) <a href="https://twitter.com/GrahamHelton3/status/2015789985459212714?ref_src=twsrc%5Etfw">January 26, 2026</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In this post, we'll spin up a K3s cluster in a [SlicerVM](https://slicervm.com) microVM and run Graham's detection script to check for affected service accounts.

There are multiple ways to run Kubernetes within a microVM, depending on your needs and use-case.

* [Stable control-plane, with autoscaling nodes](https://docs.slicervm.com/examples/autoscaling-k3s/)
* [Slicer across multiple physical hosts](https://docs.slicervm.com/examples/multiple-machine-k3s/)
* [A simple 3-node HA cluster](https://docs.slicervm.com/examples/ha-k3s/)

The example used in this post is a single-node cluster designed to be disposable, and only to be used within the microVM, not from other hosts via kubectl.

## Step 1: Create a userdata script

On a machine with Linux installed, and KVM available (bare-metal or nested virtualization), [install Slicer](https://docs.slicervm.com/getting-started/install/).

You can use a [commercial seat, or your Home Edition license](https://slicervm.com/pricing).

Create a working directory for the lab.

```bash
mkdir -p k3s-rce
cd k3s-rce
```

Create `userdata.sh` to bootstrap K3s:

```bash
#!/bin/bash
set -ex

export HOME=/home/ubuntu
export USER=ubuntu
cd /home/ubuntu/

(
arkade update
arkade get kubectl k3sup jq --path /usr/local/bin
chown $USER /usr/local/bin/*
mkdir -p .kube
)

(
k3sup install --local --k3s-extra-args '--disable traefik'
mv ./kubeconfig ./.kube/config
chown $USER .kube/config
)

export KUBECONFIG=/home/ubuntu/.kube/config

k3sup ready --kubeconfig $KUBECONFIG

echo "export KUBECONFIG=/home/ubuntu/.kube/config" >> $HOME/.bashrc
chown -R $USER $HOME
```

## Step 2: Generate the VM config and start it

```bash
slicer new k3s-rce \
  --net=isolated \
  --allow=0.0.0.0/0 \
  --cpu=2 \
  --ram=4 \
  --userdata-file ./userdata.sh \
  --graceful-shutdown=false \
  > k3s-rce.yaml
```

Start the VM:

```bash
sudo -E slicer up ./k3s-rce.yaml
```

Wait until userdata has fully completed:

```bash
sudo -E slicer vm health
HOSTNAME                  AGENT UPTIME         SYSTEM UPTIME        AGENT VERSION   USERDATA RAN
--------                  ------------         -------------        -------------   ------------
k3s-rce-1                 22s                  22s                  0.1.57          1         
```

## Step 3: Run Graham's detection script

Shell into the VM:

```bash
sudo -E slicer vm shell --uid 1000
```

Download and run [Graham's detection script](https://gist.githubusercontent.com/grahamhelton/f5c8ce265161990b0847ac05a74e466a/raw/cad5073f2a1c3edc5ea5a1db81a4f860fb60d271/detect-nodes-proxy.sh):

```bash
curl -sLO https://gist.githubusercontent.com/grahamhelton/f5c8ce265161990b0847ac05a74e466a/raw/cad5073f2a1c3edc5ea5a1db81a4f860fb60d271/detect-nodes-proxy.sh
chmod +x detect-nodes-proxy.sh
./detect-nodes-proxy.sh
```

The script will scan your cluster for service accounts with `nodes/proxy` permissions and report any that could be exploited.

Now create a new ClusterRole with the `nodes/proxy` GET permission, along with a ServiceAccount and RoleBinding to use it.

```bash
kubectl create clusterrole nodes-proxy-rce \
  --verb=get \
  --resource=nodes/proxy
kubectl create serviceaccount nodes-proxy-rce
kubectl create rolebinding nodes-proxy-rce \
  --clusterrole=nodes-proxy-rce \
  --serviceaccount=default:nodes-proxy-rce
```

Run Graham's detection script again:

```bash
./detect-nodes-proxy.sh
```

You should see the new service account listed as affected.

```bash
[+] Checking RoleBindings
[!] Vulnerable Service Account: default/nodes-proxy-rce -> nodes-proxy-rce (binding ns: default)
  Verify: kubectl auth can-i get nodes --subresource=proxy --as=system:serviceaccount:default:nodes-proxy-rce

```

Let's run the verify command:

```bash
kubectl auth can-i get nodes --subresource=proxy --as=system:serviceaccount:default:nodes-proxy-rce
```

You should see the output:

```bash
Yes
```

## Wrapping up

This is a real quirk in Kubernetes RBAC—the fact that `GET` vs `CREATE` authorization depends on the transport protocol is surprising. Graham's script makes it easy to audit your clusters for affected service accounts.

Over on the [OpenFaaS blog post](https://www.openfaas.com/blog/kubernetes-node-proxy-rce/), we've written up a more detailed explanation of the potential impact of this vulnerability for OpenFaaS users, and how to mitigate it.

See also:

- [Graham Helton's detection script (Gist)](https://gist.githubusercontent.com/grahamhelton/f5c8ce265161990b0847ac05a74e466a/raw/cad5073f2a1c3edc5ea5a1db81a4f860fb60d271/detect-nodes-proxy.sh)
- [Graham Helton's full disclosure](https://grahamhelton.com/blog/nodes-proxy-rce)
- [Interactive lab on iximiuz](https://labs.iximiuz.com/tutorials/nodes-proxy-rce-c9e436a9)
- [HA Kubernetes lab with Slicer](https://docs.slicervm.com/examples/ha-k3s/)

