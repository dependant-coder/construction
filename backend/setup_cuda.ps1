# Uninstall CPU PyTorch if present
pip uninstall torch torchvision torchaudio -y

# Install CUDA 12.6 PyTorch
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126

# Install remaining deps
pip install -r requirements.txt

# Verify
python -c "import torch; print('CUDA available:', torch.cuda.is_available()); print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'NONE')"
