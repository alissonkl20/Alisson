"use client";

import { FileDown, Mail } from "lucide-react";
import { profile } from "@/shared/config/data";

function LinkedInIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.56V9h3.554v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

type ProfileActionsProps = {
  visible?: boolean;
};

export function ProfileActions({ visible = true }: ProfileActionsProps) {
  return (
    <nav
      className={`profile-actions${visible ? " profile-actions--visible" : ""}`}
      aria-label="Links de contato e currículo"
    >
      <a
        href={profile.cv}
        download="Alisson_Almeida_CV.pdf"
        className="profile-actions__btn profile-actions__btn--primary"
        aria-label="Baixar currículo em PDF"
      >
        <FileDown size={16} aria-hidden />
        <span>Currículo</span>
      </a>

      <a
        href={profile.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="profile-actions__btn"
        aria-label="Perfil no LinkedIn (abre em nova aba)"
      >
        <LinkedInIcon />
        <span>LinkedIn</span>
      </a>

      <a
        href={`mailto:${profile.email}`}
        className="profile-actions__btn"
        aria-label={`Enviar e-mail para ${profile.email}`}
      >
        <Mail size={16} aria-hidden />
        <span>E-mail</span>
      </a>
    </nav>
  );
}
