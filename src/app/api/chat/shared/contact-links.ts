export const CONTACT_LINKS = {
  linkedin: "https://www.linkedin.com/in/alissonalmeida9/",
  email: "mailto:almeidadeoliveiraalisson04@gmail.com",
  whatsapp: "https://wa.me/5546999420574",
} as const;

export type ContactLinks = typeof CONTACT_LINKS;

export const LIMIT_REACHED_REPLY =
  "Você atingiu o limite de 10 perguntas por dia neste chat. Para continuar a conversa, entre em contato diretamente:";
