import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
def build_pdf(filename, image_paths):
    # Setup document geometry (0.75 inch margins = 54 points)
    margin = 54
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        rightMargin=margin,
        leftMargin=margin,
        topMargin=margin,
        bottomMargin=margin
    )
    
    styles = getSampleStyleSheet()
    
    # Custom color palette
    primary_color = HexColor('#1e293b')   # Deep Slate Blue
    secondary_color = HexColor('#06b6d4') # Tech Cyan
    text_color = HexColor('#334155')      # Muted Dark Slate
    bg_light = HexColor('#f8fafc')        # Clean background tint
    border_color = HexColor('#cbd5e1')    # Grey border
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=primary_color,
        spaceAfter=10,
        alignment=0 # Left
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceAfter=30
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=primary_color,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=secondary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=10
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['BodyText'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=6
    )
    
    header_cell_style = ParagraphStyle(
        'HeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white
    )
    
    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=text_color
    )
    story = []
    
    # -------------------------------------------------------------------------
    # COVER PAGE
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 100))
    # Glowing accent line
    t_bar = Table([['']], colWidths=[504], rowHeights=[4])
    t_bar.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), secondary_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_bar)
    story.append(Spacer(1, 20))
    story.append(Paragraph("PROMPTSCOPE", title_style))
    story.append(Paragraph("Pre-Inference Ingestion Prompt Firewall for Healthcare AI", subtitle_style))
    
    # Metadata block
    meta_data = [
        [Paragraph("<b>Document Type:</b> Technical Architecture & Security Specifications Report", cell_style)],
        [Paragraph("<b>Target Domain:</b> Healthcare & Assistive Technologies AI Systems", cell_style)],
        [Paragraph("<b>Core Frameworks:</b> IEEE TIPPSS Alignment & NIST SP 800 Compliance", cell_style)],
        [Paragraph("<b>Created Date:</b> June 2026", cell_style)]
    ]
    meta_table = Table(meta_data, colWidths=[400])
    meta_table.setStyle(TableStyle([
        ('LINELEFT', (0,0), (0,-1), 2, secondary_color),
        ('LEFTPADDING', (0,0), (0,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(meta_table)
    
    story.append(Spacer(1, 200))
    story.append(Paragraph("CONFIDENTIAL | INTENDED FOR CLINICAL AI SECURITY TEAMS ONLY", ParagraphStyle('Conf', parent=body_style, fontSize=8, textColor=colors.gray)))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # SECTION 1: ARCHITECTURE & SCALABILITY
    # -------------------------------------------------------------------------
    story.append(Paragraph("1. Technical System Architecture", h1_style))
    story.append(Paragraph(
        "To handle a growing user base and high-throughput data volumes, PromptScope is designed "
        "using a decentralized edge-processing model. Instead of routing all raw inputs to a single "
        "central firewall instance, the core evaluation engine is compiled into lightweight WebAssembly "
        "(Wasm) modules. These modules are deployed to edge nodes like Cloudflare Workers or AWS Lambda@Edge. "
        "This edge execution allows PromptScope to intercept, inspect, and sanitize incoming medical "
        "reports or patient messages within 10 milliseconds, preventing latency overhead before prompts "
        "are dispatched to core LLM engines.",
        body_style
    ))
    story.append(Paragraph(
        "For horizontal scaling, PromptScope runs as a stateless gRPC/HTTP proxy service inside multi-region "
        "Kubernetes clusters (AWS EKS or Google GKE). Pod instances scale dynamically based on real-time metrics, "
        "such as concurrent request counts and CPU utilization. High-throughput ingestion logs and system "
        "audit trails are managed asynchronously. Rather than writing directly to databases during inference, "
        "logs are streamed to Apache Kafka queues. Consumers pull events from Kafka to update high-performance "
        "databases (such as ClickHouse for analytics and MongoDB for log storage) without slowing the client's "
        "clinical request lifecycle.",
        body_style
    ))
    story.append(Paragraph(
        "Data sharding is configured by partitioning log databases according to hospital node IDs and "
        "geographical jurisdictions, ensuring that patient records remain localized to comply with regional "
        "data residency guidelines.",
        body_style
    ))
    
    # Add System Architecture Diagram
    story.append(Spacer(1, 10))
    if 'system_architecture' in image_paths and os.path.exists(image_paths['system_architecture']):
        # Set max width to 450 points, height proportional (assume original is roughly 16:9 or 4:3, e.g. w=450, h=300)
        img = Image(image_paths['system_architecture'], width=450, height=270)
        img.hAlign = 'CENTER'
        story.append(img)
        story.append(Paragraph("<font color='gray'><b>Figure 1:</b> PromptScope Layered Technical Architecture Schematic</font>", ParagraphStyle('Cap1', parent=body_style, fontSize=8, alignment=1)))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # SECTION 2: SEQUENTIAL DATA-FLOW LIFECYCLE
    # -------------------------------------------------------------------------
    story.append(Paragraph("2. Prompt Ingestion & Validation Lifecycle", h1_style))
    story.append(Paragraph(
        "The PromptScope validation cycle operates at the pre-inference layer, standing as a prompt "
        "firewall between raw incoming records and clinical Large Language Models. Every prompt "
        "traverses three pipeline steps: structural parsing, semantic scanning, and policy enforcement.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Stage 1: Structural Extraction:</b> Deconstructs document files (such as PDFs, referrals, "
        "or chat inputs) into clean text blocks. It inspects metadata layers for hidden commands, identifies "
        "unusual white-space structures, and detects encoded string segments that could act as payload vectors.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Stage 2: Semantic Security Scan:</b> Feeds clean text inputs into a fast, local semantic embedding "
        "comparer. The system checks prompt similarity scores against historical database libraries of prompt "
        "injections, patient health info (PHI) dump commands, and medical bias override instructions.",
        body_style
    ))
    story.append(Paragraph(
        "<b>Stage 3: Policy Enforcement:</b> Applies standard strictness metrics (Strict, Balanced, or "
        "Permissive). Based on risk ratings, it triggers actions: <i>Allow</i>, <i>Sanitize</i> (redacting "
        "SSNs or removing override commands), or <i>Block</i> (halting downstream LLM calls and creating alert logs).",
        body_style
    ))
    
    # Add Data Flow Diagram
    story.append(Spacer(1, 10))
    if 'data_flow' in image_paths and os.path.exists(image_paths['data_flow']):
        img = Image(image_paths['data_flow'], width=450, height=270)
        img.hAlign = 'CENTER'
        story.append(img)
        story.append(Paragraph("<font color='gray'><b>Figure 2:</b> Sequence Data-Flow Lifecycle across Processing Stages</font>", ParagraphStyle('Cap2', parent=body_style, fontSize=8, alignment=1)))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # SECTION 3: NETWORK TOPOLOGY & trust boundaries
    # -------------------------------------------------------------------------
    story.append(Paragraph("3. Network Topology & Trust Boundaries", h1_style))
    story.append(Paragraph(
        "PromptScope implements a secure, segmented network design separating public entry points "
        "from sensitive clinical databases. Trust boundaries are enforced at three logical perimeters: "
        "the Untrusted Public Zone, the DMZ Security Zone, the Private VPC, and the secure WORM Database Zone.",
        body_style
    ))
    story.append(Paragraph(
        "All incoming public connections traverse Cloudflare edge security groups before hitting compiled "
        "Wasm edge firewall scripts. Only clean gRPC requests from validated edge workers are allowed "
        "through internal API gateways to our EKS core cluster. Database instances and downstream "
        "clinical LLM servers reside in fully isolated, private subnets. They cannot communicate with the "
        "outside internet directly, completely eliminating direct external data extraction attempts.",
        body_style
    ))
    
    # Add Network Topology Diagram
    story.append(Spacer(1, 10))
    if 'network_topology' in image_paths and os.path.exists(image_paths['network_topology']):
        img = Image(image_paths['network_topology'], width=450, height=270)
        img.hAlign = 'CENTER'
        story.append(img)
        story.append(Paragraph("<font color='gray'><b>Figure 3:</b> PromptScope Network Zoning and Security Topology</font>", ParagraphStyle('Cap3', parent=body_style, fontSize=8, alignment=1)))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # SECTION 4: THREAT MODEL & MITIGATION MATRIX (STRIDE)
    # -------------------------------------------------------------------------
    story.append(Paragraph("4. STRIDE Threat Model Mapping Matrix", h1_style))
    story.append(Paragraph(
        "To evaluate prompt firewall effectiveness, we map system vulnerabilities to STRIDE categories, "
        "specifying targeted components and mitigation architectures below:",
        body_style
    ))
    
    # Table data
    table_data = [
        [Paragraph("Category", header_cell_style), Paragraph("Targeted Component", header_cell_style), Paragraph("PromptScope Mitigation Design", header_cell_style)],
        [
            Paragraph("<b>Spoofing</b>", cell_style),
            Paragraph("IAM Auth Proxy", cell_style),
            Paragraph("Enforces multi-factor authentication (MFA) and verifies cryptographically signed JSON Web Tokens (JWTs) with granular clinical roles.", cell_style)
        ],
        [
            Paragraph("<b>Tampering</b>", cell_style),
            Paragraph("Stage 1: Parser", cell_style),
            Paragraph("Strips zero-width spacing, de-formats encoded strings, and conducts text parsing in an isolated container sandbox before LLM assembly.", cell_style)
        ],
        [
            Paragraph("<b>Repudiation</b>", cell_style),
            Paragraph("Audit Trail Ledger", cell_style),
            Paragraph("Logs are streamed to Apache Kafka queues and committed to Write-Once-Read-Many (WORM) storage. All logs are signed with SHA-256 block hashes.", cell_style)
        ],
        [
            Paragraph("<b>Information Disclosure</b>", cell_style),
            Paragraph("Stage 2: Scanner", cell_style),
            Paragraph("Calculates vector embeddings and cross-checks prompt similarity against known PHI leakage schemas, automatically blocking high-similarity payloads.", cell_style)
        ],
        [
            Paragraph("<b>Denial of Service</b>", cell_style),
            Paragraph("Wasm Edge Node", cell_style),
            Paragraph("Enforces file volume and size constraints at ingress, backed by rate-limiting algorithms at the API Gateway proxy layer.", cell_style)
        ],
        [
            Paragraph("<b>Elevation of Privilege</b>", cell_style),
            Paragraph("Stage 3: Enforcer", cell_style),
            Paragraph("Enforces strict threshold policies (Strict, Balanced, Permissive). Blocks execution before Downstream Clinical AI models can ingest the override.", cell_style)
        ]
    ]
    
    # Table sizing
    stride_table = Table(table_data, colWidths=[100, 110, 294])
    stride_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    
    story.append(stride_table)
    story.append(PageBreak())
    # -------------------------------------------------------------------------
    # SECTION 5: ENTERPRISE DEPLOYMENT, SECURITY CONTROLS & COMPLIANCE
    # -------------------------------------------------------------------------
    story.append(Paragraph("5. Security Controls & Standards Compliance", h1_style))
    
    story.append(Paragraph("5.1 Zero-Trust Encryption Controls", h2_style))
    story.append(Paragraph(
        "PromptScope embeds security controls throughout its data pipeline to maintain a hardened posture. "
        "We follow a Zero-Trust architecture where every single request is treated as untrusted and subjected "
        "to isolation and scanning. All communications are encrypted using TLS 1.3 in transit and AES-256-GCM "
        "at rest, with cryptographic keys managed by secure Hardware Security Modules (HSMs). For Identity "
        "and Access Management (IAM), we enforce strict Role-Based Access Control (RBAC) via OAuth 2.0 scopes, "
        "limiting access to policies and logs based on user roles (e.g., Clinician, Security Administrator, "
        "Compliance Auditor).",
        body_style
    ))
    story.append(Paragraph(
        "To future-proof the platform against decryption risks, all API channels are designed with post-quantum "
        "cryptography (PQC) readiness. We utilize hybrid key encapsulation mechanisms (such as Kyber-768/ML-KEM-768) "
        "alongside standard Elliptic Curve Diffie-Hellman (ECDH). Audit trails are cryptographically chained and "
        "signed using SHA-256, preventing retro-active tampering. These logs are stored in write-once-read-many "
        "(WORM) database configurations, ensuring their admissibility during formal regulatory audits.",
        body_style
    ))
    story.append(Paragraph("5.2 Global Standards Alignment", h2_style))
    story.append(Paragraph(
        "PromptScope complies with and builds upon existing global standards. Our access controls, logging "
        "protocols, and encryption practices align with the NIST SP 800-53 security controls framework. We "
        "specifically map to the System and Information Integrity (SI-3, SI-4) and Access Control (AC-2, AC-3) "
        "families. We map directly to ISO/IEC 27001 requirements, implementing Annex A controls for information "
        "security management, logging (A.12.4), and secure development (A.14).",
        body_style
    ))
    story.append(Paragraph(
        "In terms of privacy, PromptScope enforces controls compliant with ISO/IEC 27701 (Privacy Information "
        "Management) and NIST SP 800-122 (Security of Personally Identifiable Information). Furthermore, our "
        "software development practices follow the NIST Secure Software Development Framework (SSDF/SP 800-218) "
        "guidelines, ensuring secure code compilation and vulnerability management.",
        body_style
    ))
    
    story.append(PageBreak())
    # -------------------------------------------------------------------------
    # SECTION 6: ROADMAP & TIMELINES
    # -------------------------------------------------------------------------
    story.append(Paragraph("6. Project Roadmap & Development Timeline", h1_style))
    story.append(Paragraph(
        "The project engineering lifecycle is mapped to five key milestones over a 24-week period to ensure "
        "thorough testing, code hardening, and compliance verification before hospital production rollout.",
        body_style
    ))
    
    # Roadmap items
    story.append(Paragraph("• <b>Weeks 1-6: MVP Core Backend:</b> Build the Rust gRPC validation server, set up pgvector databases, and configure OAuth 2.0 client authentication and token validation.", bullet_style))
    story.append(Paragraph("• <b>Weeks 7-12: Document Parsing & Edge Deployments:</b> Deploy edge workers for prompt checking. Construct serverless OCR components using AWS Textract. Implement active-active database clustering.", bullet_style))
    story.append(Paragraph("• <b>Weeks 13-16: Threat Emulation & Penetration Testing:</b> Incorporate automated threat testing via Promptfoo. Execute third-party grey-box penetration testing and resolve findings.", bullet_style))
    story.append(Paragraph("• <b>Weeks 17-20: Compliance Audits & Staging Rollout:</b> Perform formal assessments for HIPAA, SOC 2, and ISO 27001 compliance. Deploy the complete application to hospital staging clusters for user acceptance testing (UAT).", bullet_style))
    story.append(Paragraph("• <b>Weeks 21-24: Production Rollout:</b> Conduct active-active deployments in public clouds. Initiate enterprise support and release the production portal to pilot healthcare organizations.", bullet_style))
    
    # Spacer and final signature block
    story.append(Spacer(1, 40))
    sig_data = [
        [Paragraph("<b>Prepared By:</b> PromptScope Engineering Group", cell_style), Paragraph("<b>Status:</b> Approved for Ingestion", cell_style)],
        [Paragraph("<b>Approved By:</b> Lead AI Security Auditor", cell_style), Paragraph("<b>Integrity Hash:</b> SHA-256:4C8F90AD", cell_style)]
    ]
    sig_table = Table(sig_data, colWidths=[250, 254])
    sig_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,0), 1, border_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(sig_table)
    
    # Build Document
    doc.build(story)
if __name__ == "__main__":
    # Receive target filename and image paths from arguments
    # Arguments structure: [pdf_output_path, system_arch_path, data_flow_path, network_topology_path]
    if len(sys.argv) < 5:
        print("Usage: python generate_pdf.py <pdf_path> <sys_arch_path> <data_flow_path> <network_topology_path>")
        sys.exit(1)
        
    pdf_path = sys.argv[1]
    image_paths = {
        'system_architecture': sys.argv[2],
        'data_flow': sys.argv[3],
        'network_topology': sys.argv[4]
    }
    
    print(f"Building PDF at: {pdf_path}")
    build_pdf(pdf_path, image_paths)
    print("PDF build complete successfully.")