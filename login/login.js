document
  .getElementById("admin-login-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(
        "https://projeto-1-c5b0af5ed27e.herokuapp.com/api/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Armazene o token JWT no localStorage
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Redirecionar para a página de edição
        window.location.href =
          "https://moraismariana.github.io/carta-eleanor-lp-refatorado/edit/";
      } else {
        alert("Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  });
