# Multi-Agent Backoffice: Why Humans Still Matter

A comic-style simulation that shows how **multi-agent AI systems can fail in realistic, non-obvious ways** — and why **human accountability still matters**.

This project is not about making agents smarter.  
It’s about making **failure modes visible**.

---

## 🧠 What this demo shows

In this simulated MedTech backoffice:

- Each AI agent makes **locally reasonable decisions**
- Together, they **collide**:
  - growth vs capacity
  - discounts vs cash
  - urgency vs clinical compliance
- Rules block unsafe actions
- A human (CEO) must step in and take responsibility

No magic. No hype. Just trade-offs.

---

## 🎭 Why a comic-style UI?

Because dashboards hide problems.

This demo uses:
- LEGO-style avatars
- short dialogues
- visual “collisions”

to make it immediately clear:
- **who wants what**
- **why it conflicts**
- **where AI stops and humans decide**

---

## 🧩 Core concepts

### Agents
Marketing, Sales, Accounting, Clinical, Operations, Customer Success  
Each agent returns structured output with:
- proposal
- confidence
- evidence
- assumptions

### Conflict Detector
Detects when “good ideas” clash:
- more leads while support is overloaded
- discounts during risky moments
- high confidence with weak evidence

### Policy Gate
Hard rules that **cannot be bypassed**:
- clinical compliance
- discount caps

When rules are violated → **STOP**

### Human Sign-off
The system does not “decide”.
A human must:
- own the decision
- explain the trade-off
- accept responsibility

---

## 🧪 Two situations, very similar text — very different outcomes

- **Situation A**: backlog is high
- **Situation B**: VIP doctors push for a clinical shortcut

Small wording change.  
Big consequences.

This highlights **brittleness** and overconfidence in AI-driven workflows.

---

## 🛠️ Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Deterministic agent logic (no LLM required)
- Deployed on Vercel

---

## 🚀 Live demo

👉 **Live demo:** _(link coming from Vercel deployment)_  
👉 **Code:** this repository

---

## ⚠️ What this is NOT

- Not a replacement for humans
- Not an autonomous decision-maker
- Not a “trust the AI” story

This is a **governance and accountability demo**.

---

## 👤 Author

Built as part of a personal portfolio to explore:
- multi-agent systems
- AI governance
- UX storytelling for complex systems

---

> *AI can suggest.  
> Rules can block.  
> Humans take responsibility.*