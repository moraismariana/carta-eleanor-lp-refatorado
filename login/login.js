document
  .getElementById("admin-login-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Armazene o token JWT no localStorage
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        // Redirecionar para a página de edição
        window.location.href = "http://127.0.0.1:5500/edit/";
      } else {
        alert("Erro ao fazer login. Verifique suas credenciais.");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  });
