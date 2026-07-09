<h1 class="title is-1 publication-title">MeshRipple: Structured Autoregressive Generation of Artist-Meshes</h1>
<h4 align="center" style="line-height:1.4; margin-top:0.6rem">
  <a href="https://github.com/MayMhappy">Junkai Lin</a><sup>1,*</sup>,
  <a href="https://github.com/LoHhhha">Hang Long</a><sup>1,*</sup>,
  Huipeng Guo<sup>1</sup>,
  Jielei Zhang<sup>1</sup>,
  JiaYi Yang<sup>1</sup>,
  Tianle Guo<sup>1</sup>,
  Yang Yang<sup>1</sup>,
  <a href="mailto:jianwenli.ai@gmail.com">Jianwen Li</a><sup>2</sup>,
  <a href="mailto:forever.wx.zhang@gmail.com">Wenxiao Zhang</a><sup>2</sup>,
  <a href="https://niessnerlab.org">Matthias Nießner</a><sup>3</sup>,
  <a href="https://weiyang-hust.github.io">Wei Yang</a><sup>1, †</sup>
</h4>

<p align="center" style="margin:0.2rem 0 0.6rem 0;">
  <sup>1</sup> Huazhong University of Science and Technology &nbsp;&nbsp;|&nbsp;&nbsp;
  <sup>2</sup> Independent Researcher &nbsp;&nbsp;|&nbsp;&nbsp;
  <sup>3</sup> Technical University of Munich
</p>

<p align="center" style="font-size:0.95em; color:#666; margin-top:0;">
  &nbsp;&nbsp; † Corresponding author
</p>

<p align="center">
  <a href="https://maymhappy.github.io/MeshRipple/">
    <img src="https://img.shields.io/badge/Project%20Page-blue.svg" alt="Project Page" height="22">
  </a>
  <a href="https://arxiv.org/abs/2512.07514">
      <img src="https://img.shields.io/badge/arXiv-b31b1b.svg?logo=arXiv&logoColor=white" alt="arXiv height="22">
  </a>
</p>


<h1 align="center" style="line-height:1.3; margin-bottom:0.6rem;">
  <img src="./assets/teaser.png"
       alt="MeshRipple"
       style="display:block; margin:0 auto 0.4rem auto; max-width:100%;">
</h1>

<!-- <p align="center">
    <img width="90%" alt="pipeline", src="./assets/Teaser.png">
</p> -->
</h4>

## Abstract

Meshes serve as a primary representation for 3D assets. Autoregressive mesh generators serialize faces into sequences and train on truncated segments with sliding-window inference to cope with memory limits. However, this mismatch breaks long-range geometric dependencies, producing holes and fragmented components. 
To address this critical limitation, we introduce <b>MeshRipple</b>, which expands a mesh outward from an active generation frontier, akin to a ripple on a surface.
MeshRipple rests on three key innovations: a frontier-aware BFS tokenization that aligns the generation order with surface topology; an expansive prediction strategy that maintains coherent, connected surface growth; and a sparse-attention global memory that provides an effectively unbounded receptive field to resolve long-range topological dependencies.
This integrated design enables MeshRipple to generate meshes with high surface fidelity and topological completeness, outperforming strong recent baselines.

## 1. Environment

### 1.1 Clone the repository
```bash
git clone -b main --single-branch https://github.com/MayMhappy/MeshRipple.git
```
### 1.2 Create environment

```bash
conda create -n meshripple python=3.12 -y
conda activate meshripple
```

### 1.3 Install dependencies

`requirement.txt` is currently empty in this repo, so install the main runtime packages manually:

```bash
pip install torch==2.8.0 torchvision==0.23.0 torchaudio==2.8.0 --index-url https://download.pytorch.org/whl/cu128
pip install -r requirement.txt 
```

For FlashAttention (needed by NSA-related code paths), install the wheel matching your CUDA + PyTorch version:

```bash
wget https://github.com/Dao-AILab/flash-attention/releases/download/v2.7.3/flash_attn-2.7.3+cu12torch2.8cxx11abiFALSE-cp312-cp312-linux_x86_64.whl
pip install flash_attn-2.7.3+cu12torch2.8cxx11abiFALSE-cp312-cp312-linux_x86_64.whl
```

If FlashAttention build fails, please first confirm your CUDA toolkit, NVCC, and PyTorch CUDA version are aligned.

## 2. Checkpoint Download

The model checkpoints should be placed under the `./ckpt/` directory. 

You can download the trained weights from [Google Drive](https://drive.google.com/drive/folders/1qex2gbIoxh4-qRbAUYxIF5b_OwvLhOxq). 

| Filename | Description |
| :--- | :--- |
| `meshRipple_10k.pth` | 10k faces version using **Full Context Attention**. |
| `meshRipple_nsa.pth` | 20k faces version using **NSA**. |

Download the desired `.pth` files and move them into `./ckpt/`.

## 3. Demo Inference

### 3.1 10k Full-Attention demo

```bash
python main.py --config config_loader/config_10k_full_dense_mesh.yaml
```

### 3.2 20k NSA demo

> **Note:** The current NSA inference implementation does not yet include KV cache support, which may result in slower generation speeds. We will integrate KV caching in a future update to significantly accelerate inference.

```bash
python main.py --config config_loader/config_20k_nsa.yaml
```

## 4. TODO

- [ ] Add NSA inference acceleration with KV cache support.
- [ ] Release the training code.

## 5. Acknowledgements

We sincerely thank the following projects:

- [IFlame](https://github.com/hanxiaowang00/iFlame)
- [native-sparse-attention-triton](https://github.com/XunhaoLai/native-sparse-attention-triton)
- [Michelangelo](https://huggingface.co/Maikou/Michelangelo)
- [DeepMesh](https://github.com/zhaorw02/DeepMesh/tree/main)
- [BPT](https://github.com/Tencent-Hunyuan/bpt)


## 6. Citations

If you find this project useful, please cite:

```bibtex
@InProceedings{Lin_2026_CVPR,
    author    = {Lin, Junkai and Long, Hang and Guo, Huipeng and Zhang, Jielei and Yang, Jiayi and Guo, Tianle and Yang, Yang and Li, Jianwen and ZHANG, Wenxiao and Nie{\ss}ner, Matthias and Yang, Wei},
    title     = {MeshRipple: Structured Autoregressive Generation of Artist-Meshes},
    booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
    month     = {June},
    year      = {2026},
    pages     = {12706-12718}
}
```