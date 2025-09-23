#!/bin/bash

# VS Code Setup Commands
echo "🔧 Setting up VS Code for Wedding Platform..."

# 1. Open project in VS Code
code .

# 2. Install recommended VS Code extensions
echo "Installing VS Code extensions..."

# Essential extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension ms-vscode.vscode-json

# React/Next.js extensions
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension burkeholland.simple-react-snippets
code --install-extension ms-vscode.vscode-react-native

# Database extensions
code --install-extension mongodb.mongodb-vscode

# Git extensions
code --install-extension eamodio.gitlens

echo "✅ VS Code extensions installed!"
