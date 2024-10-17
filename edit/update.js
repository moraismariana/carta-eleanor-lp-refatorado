document.addEventListener("DOMContentLoaded", async () => {
  // Verifica se o usuário está autenticado
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("Você precisa estar autenticado para editar.");
    window.location.href = "http://127.0.0.1:5500/login/";
    return;
  }

  // URLs das APIs
  const urls = [
    "http://127.0.0.1:8000/indextext/1",
    "http://127.0.0.1:8000/indeximage/1",
    "http://127.0.0.1:8000/indexbg/1",
    "http://127.0.0.1:8000/indexpseudoimage/1",
  ];

  try {
    // Verifica a autorização para todas as rotas simultaneamente
    const responses = await Promise.all(
      urls.map((url) =>
        fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      )
    );

    // Verifica se todas as respostas estão OK
    const allValid = responses.every((res) => res.ok);

    if (!allValid) {
      alert("Você não tem permissão para acessar todas as áreas.");
      localStorage.removeItem("accessToken");
      window.location.href = "http://127.0.0.1:5500/login/";
      return;
    }

    console.log("Acesso permitido a todas as rotas!");
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    alert("Erro ao verificar sua sessão. Por favor, faça login novamente.");
    localStorage.removeItem("accessToken");
    window.location.href = "http://127.0.0.1:5500/login/";
  }

  // PREENCHER OS DADOS DA API

  const textAPIUrl = "http://127.0.0.1:8000/indextext/1/";
  const imageAPIUrl = "http://127.0.0.1:8000/indeximage/1/";
  const bgAPIUrl = "http://127.0.0.1:8000/indexbg/1/";
  const pseudoimageAPIUrl = "http://127.0.0.1:8000/indexpseudoimage/1/";

  const [textResponse, imageResponse, bgResponse, pseudoimageResponse] =
    await Promise.all([
      fetch(textAPIUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(imageAPIUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(bgAPIUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(pseudoimageAPIUrl, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

  // Convertendo para JSON (ou tratando como necessário)
  const textos = await textResponse.json();
  const imagens = await imageResponse.json();
  const backgrounds = await bgResponse.json();
  const pseudoimagens = await pseudoimageResponse.json();

  // Armazenar valores da API em variáveis
  let textAPI_keys = Object.keys(textos);
  textAPI_keys.shift();
  let imgAPI_keys = Object.keys(imagens);
  imgAPI_keys.shift();
  let bgAPI_keys = Object.keys(backgrounds);
  bgAPI_keys.shift();
  let pseudoimgAPI_keys = Object.keys(pseudoimagens);
  pseudoimgAPI_keys.shift();

  // Armazenar valores do HTML em variáveis
  let textInput = document.getElementsByClassName("text-input");
  let imgHTML = document.getElementsByClassName("img");
  let bgHTML = document.getElementsByClassName("bg");
  let pseudoimgHTML = document.getElementsByClassName("pseudoimg-span");

  // TEXTOS
  let textAPI = Object.values(textos);
  textAPI.shift();
  for (let i = 0; i < textInput.length; i++) {
    textInput[i].value = textAPI[i];
  }

  // IMAGENS DO HTML
  let imgAPI = Object.values(imagens);
  imgAPI.shift();
  for (let i = 0; i < imgHTML.length; i++) {
    imgHTML[i].src = imgAPI[i];
  }

  // BACKGROUNDS
  let bgAPI = Object.values(backgrounds);
  bgAPI.shift();
  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].style.backgroundImage = `url(${bgAPI[i]})`;
  }

  // PSEUDOELEMENTOS
  let pseudoimgAPI = Object.values(pseudoimagens);
  pseudoimgAPI.shift();
  for (let i = 0; i < pseudoimgHTML.length; i++) {
    pseudoimgHTML[i].style.backgroundImage = `url(${pseudoimgAPI[i]})`;
  }

  // INPUT / REDIMENSIONAMENTO DE IMAGENS

  let imgInputs = document.getElementsByClassName("img-input");

  for (let i = 0; i < imgHTML.length; i++) {
    imgHTML[i].addEventListener("click", () => {
      imgInputs[i].click();
    });

    imgInputs[i].addEventListener("change", (event) => {
      let file = event.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          let img = new Image();
          img.onload = function () {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            // Obter largura e altura personalizadas dos atributos data da <img>
            let targetWidth = parseInt(imgHTML[i].getAttribute("data-width"));
            let targetHeight = parseInt(imgHTML[i].getAttribute("data-height"));

            // Calcular a proporção para o crop
            let aspectRatio = Math.max(
              targetWidth / img.width,
              targetHeight / img.height
            );
            let newWidth = img.width * aspectRatio;
            let newHeight = img.height * aspectRatio;
            let offsetX = (newWidth - targetWidth) / 2;
            let offsetY = (newHeight - targetHeight) / 2;

            // Definir o tamanho do canvas com as dimensões alvo
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Desenhar a imagem cortada e centralizada no canvas
            ctx.drawImage(img, -offsetX, -offsetY, newWidth, newHeight);

            // Converter o canvas para URL e atualizar o src da imagem
            imgHTML[i].src = canvas.toDataURL(file.type);

            // Armazenar a imagem redimensionada para referência posterior (upload para API)
            imgHTML[i].dataset.imageData = canvas.toDataURL(file.type);
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // INPUT DE BACKGROUND
  let bgInputs = document.getElementsByClassName("bg-input");

  for (let i = 0; i < bgHTML.length; i++) {
    bgHTML[i].addEventListener("click", (event) => {
      if (event.target.tagName !== "TEXTAREA") {
        bgInputs[i].click();
      }
    });

    bgInputs[i].addEventListener("change", (event) => {
      let file = event.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          bgHTML[i].style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // INPUT DE PSEUDO-ELEMENTO
  let pseudoimgInputs = document.getElementsByClassName("pseudoimg-input");

  for (let i = 0; i < pseudoimgHTML.length; i++) {
    pseudoimgHTML[i].addEventListener("click", () => {
      pseudoimgInputs[i].click();
    });

    pseudoimgInputs[i].addEventListener("change", (event) => {
      let file = event.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          pseudoimgHTML[i].style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ATUALIZAÇÃO DE DADOS DA API
  document
    .getElementById("update-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      let textFormData = new FormData();
      let imgFormData = new FormData();
      let bgFormData = new FormData();
      let pseudoFormData = new FormData();

      // TEXTOS
      for (i = 0; i < textInput.length; i++) {
        textFormData.append(textAPI_keys[i], textInput[i].value);
      }

      // IMAGENS
      for (i = 0; i < imgInputs.length; i++) {
        let img = imgInputs[i].files[0];
        if (img) {
          let imgDataUrl = imgHTML[i].dataset.imageData;
          if (imgDataUrl) {
            let response = await fetch(imgDataUrl);
            let blob = await response.blob();
            imgFormData.append(imgAPI_keys[i], blob, `imagem-${i + 1}.png`);
          }
        }
      }

      // BACKGROUNDS
      for (i = 0; i < bgInputs.length; i++) {
        let bg = bgInputs[i].files[0];
        if (bg) {
          bgFormData.append(bgAPI_keys[i], bg, `background-${i + 1}.png`);
        }
      }

      // PSEUDOELEMENTOS
      for (i = 0; i < pseudoimgInputs.length; i++) {
        let pseudo = pseudoimgInputs[i].files[0];
        if (pseudo) {
          pseudoFormData.append(
            pseudoimgAPI_keys[i],
            pseudo,
            `pseudoimg-${i + 1}.png`
          );
        }
      }

      const routesAndData = [
        { url: textAPIUrl, formData: textFormData },
        { url: imageAPIUrl, formData: imgFormData },
        { url: bgAPIUrl, formData: bgFormData },
        { url: pseudoimageAPIUrl, formData: pseudoFormData },
      ];

      try {
        const responses = await Promise.all(
          routesAndData.map(({ url, formData }) =>
            fetch(url, {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            })
          )
        );

        const allSuccessful = responses.every((res) => res.ok);

        if (!allSuccessful) {
          throw new Error("Erro ao atualizar uma ou mais APIs.");
        }

        alert("Todas as atualizações foram realizadas com sucesso!");
        window.location.href = "/";
      } catch (error) {
        console.error("Erro ao atualizar os dados:", error);
        alert("Você não tem permissão para atualizar os dados.");
      }
    });
});
