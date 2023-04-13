import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  //enviar el email
  const info = await transporter.sendMail({
    //quien lo envia
    from: "APV - Administrador",

    //a quien se le envia
    to: email,

    //Asunto
    subject: "Restablece tu password",

    //el texto del correo
    text: "Restablece tu password",

    //url
    html: `<p>Hola: ${nombre}, has solicitado restablecer tu password.</p>
        <p>Sigue el siguiete enlace para generar un nuevo password:
         <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>
        </p>
        
        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
    `,
  });

  console.log(("Mensaje enviado: %s", info.messageId));
};

export default emailOlvidePassword;
