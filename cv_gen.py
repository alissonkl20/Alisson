from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor

pdf_path = "public/cv.pdf"

doc = SimpleDocTemplate(
    pdf_path,
    pagesize=A4,
    rightMargin=2 * cm,
    leftMargin=2 * cm,
    topMargin=2 * cm,
    bottomMargin=2 * cm,
)

styles = getSampleStyleSheet()

name_style = ParagraphStyle(
    "Name",
    parent=styles["Heading1"],
    fontName="Helvetica-Bold",
    fontSize=24,
    leading=28,
    textColor=HexColor("#111111"),
    spaceAfter=4,
)

headline_style = ParagraphStyle(
    "Headline",
    parent=styles["Normal"],
    fontName="Helvetica",
    fontSize=11,
    leading=14,
    textColor=HexColor("#555555"),
    spaceAfter=2,
)

section_title = ParagraphStyle(
    "SectionTitle",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=14,
    leading=18,
    textColor=HexColor("#0f3c6f"),
    spaceAfter=8,
    spaceBefore=14,
)

body_style = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=11,
    leading=16,
    textColor=HexColor("#333333"),
    spaceAfter=8,
)

highlight_style = ParagraphStyle(
    "Highlight",
    parent=body_style,
    textColor=HexColor("#111111"),
)

story = []

story.append(Paragraph("Alisson de Almeida de Oliveira", name_style))
story.append(
    Paragraph(
        "Analista de Sistemas | Python | Flask | PostgreSQL | React | API RESTful",
        headline_style,
    )
)
story.append(
    Paragraph(
        "Jaraguá do Sul, SC | (46) 99942-0574 | "
        "almeidadeoliveiraalisson04@gmail.com | github.com/alissonkl20 | "
        "https://alissonkl20.vercel.app/",
        headline_style,
    )
)

story.append(Spacer(1, 12))

story.append(Paragraph("Sobre", section_title))
story.append(
    Paragraph(
        "Desenvolvedor Fullstack com mais de 2 anos de experiência em aplicações web "
        "com foco em escalabilidade e robustez, procurando sempre gerar a melhor "
        "experiência para o usuário por meio de soluções limpas e de alto desempenho.",
        body_style,
    )
)

story.append(Paragraph("Conhecimentos", section_title))
story.append(
    Paragraph(
        "Java Spring Boot · Python Flask · TypeScript · React · APIs RESTful · LLMs · "
        "PostgreSQL · Docker · UI/UX · Automação de testes · Refatoração de código.",
        body_style,
    )
)

story.append(Paragraph("Experiência profissional", section_title))
story.append(Paragraph("<b>Desenvolvedor Full Stack - Freelancer</b>", highlight_style))
story.append(Paragraph("jun 2025 – set 2025", headline_style))
story.append(
    Paragraph(
        "Atuei na melhoria de uma plataforma SaaS, otimizando performance, estabilidade "
        "e UI/UX. Realizei manutenção, correções de fluxo, refatoração e ajustes de "
        "responsividade, além de apoiar testes para identificar gargalos.",
        body_style,
    )
)
story.append(
    Paragraph(
        "<b>Tecnologias:</b> React, Tailwind, JS/TS, Python, Flask, APIs RESTful, "
        "MySQL, Docker e GitHub.",
        body_style,
    )
)

story.append(Spacer(1, 8))
story.append(Paragraph("<b>WhaticketSaaS – Desenvolvedor Full Stack (Freelancer)</b>", highlight_style))
story.append(Paragraph("mai 2024 – nov 2024", headline_style))
story.append(
    Paragraph(
        "Desenvolvi e entreguei o módulo completo de transcrição de áudio, atuando "
        "end-to-end no backend e frontend. Realizei manutenção corretiva, resolução "
        "de bugs e otimizações de performance.",
        body_style,
    )
)
story.append(
    Paragraph(
        "<b>Tecnologias:</b> React, TypeScript, Material-UI, Node.js, Express, "
        "PostgreSQL e GitHub.",
        body_style,
    )
)

story.append(Paragraph("Educação", section_title))
story.append(
    Paragraph(
        "<b>Tecnólogo – Análise e Desenvolvimento de Sistemas</b><br/>"
        "Católica de Santa Catarina – Centro Universitário | 2024 – 2027",
        body_style,
    )
)

story.append(Spacer(1, 16))
story.append(
    Paragraph(
        "<para align='center'><b>"
        "Aberto a posições remotas, híbridas e presenciais, projetos colaborativos "
        "em que eu possa evoluir profissionalmente e contribuir com soluções de impacto." 
        "<br/><br/>"
        "Vamos nos conectar e explorar como posso ajudar a impulsionar seus projetos digitais!"
        "</b></para>",
        body_style,
    )
)

doc.build(story)
