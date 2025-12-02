# 📉 Vibe Code Detector

> **Status:** 🟢 Certified Vibe Coded  
> **Author:** A human (barely) & Gemini 2.5

## 🧐 What is this?

You know that feeling when you look at a pull request and it's just... *too* clean? The comments are overly helpful? The variable names actually make sense? 

You're probably looking at **Vibe Coding**.

**Vibe Code Detector** analyzes GitHub repositories to determine if they were built by a human sweating over syntax errors or a developer surfing the wave of LLM autocompletion (Cursor, Windsurf, Copilot, etc.).

We use **Google Gemini 2.5 Flash** to judge your commit history, config files, and file structure to give you a "Vibe Score" (0-100%).
- **0%**: You wrote this in Vim on a ThinkPad from 2008.
- **100%**: You pressed `Tab` until the project compiled.

## 🤡 The Meta Layer (Read this part)

**This entire application was Vibe Coded.**

I (the "developer") didn't write this README. I didn't write the CSS. I definitely didn't write the regex for parsing GitHub URLs. I just prompted an AI until it looked cool.

This tool is a hypocrite. It uses AI to judge you for using AI. It is the Spider-Man pointing meme in software form.

## 📸 Screenshots

### The Landing Page
![Landing Page](/assets/landing.png)

### The Verdict
![Result Page](/assets/result.png)
*(Analysis of [l0kt33n/vibe-check](https://github.com/l0kt33n/vibe-check) - Spoiler: It scored high)*

## 🚀 Features

- **The Vibe Meter**: A glowing gauge that judges your soul.
- **AI Forensic Analysis**: Detects `.cursorrules`, `.windsurfrules`, and commit messages that sound like a robot trying to be human ("Update functionality of the widget component to enhance user experience").
- **Snarky Verdicts**: "Certified Vibe Coded", "Human-AI Hybrid", "Artisanal Spaghet".
- **Dark Mode Only**: Because real developers (and AIs) hate the sun.

## 🛠️ Tech Stack (The "Vibe Stack")

- **React 19**: Because stability is for people who write their own code.
- **Tailwind CSS**: Because `style={{}}` is too hard to type.
- **Google Gemini API**: The brain.
- **GitHub API**: The victim.

## 🏃‍♂️ How to Run

1. Clone this repo.
2. Get a Gemini API Key (good luck finding the billing console).
3. `export API_KEY=your_key`
4. `npm install`
5. `npm start`
6. Question your reality.

## ⚖️ Disclaimer

The "Vibe Score" is calculated by a hallucinating language model. Do not use this for hiring decisions, firing decisions, or marital disputes.

---
*Repo analyzed by Vibe Code Detector results: 99% Vibe Coded. Verdict: "Recursive Singularity".*
