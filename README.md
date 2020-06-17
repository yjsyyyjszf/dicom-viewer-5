# Harpia DICOM Viewer

Visualizador de imagens médicas fundamentado no DICOM Web Viewer (DWV) do [https://github.com/ivmartel](https://github.com/ivmartel)

![images/readme/Untitled.png](images/readme/Untitled.png)

### Rodar local

Instruções para rodar local

Para rodar em sua máquina, sugiro que tenha instalado:

- Node
- Visual Studio Code
- Extensão Live Server no VS Code

Se tiver isso instalado, é só baixar o projeto, abrir no VS Code e excutar o index.html no Go Live do Live Server.

### Acessar remoto

Ou pode acessar o visualizador através de:

[https://andre23arruda.github.io/dicom-viewer/stable/](https://andre23arruda.github.io/dicom-viewer/stable/)

## Carregando imagens:

Com esse visualizador é possível carregar imagens locais ou remotas.

### Imagens locais:

![images/readme/Untitled%201.png](images/readme/Untitled%201.png)

Selecione os arquivos de imagem que deseja carregar

![images/readme/Untitled%202.png](images/readme/Untitled%202.png)

Se carregou mais de uma imagem, será possível apertar no botão para alterar a imagem

### Imagens remotas

![images/readme/Untitled%203.png](images/readme/Untitled%203.png)

Para não existir problema com política de CORS, pode usar a seguinte URL no input

[https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/pasta.png](https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/pasta.png),[https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/](https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/pasta.png)dicom_teste.dcm,[https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/](https://raw.githubusercontent.com/andre23arruda/dicom-viewer/gh-pages/images/pasta.png)pasta_annotations.json