---
pattern: "Build a storyboard against the actual narration; verify model cache, content and usage rights separately from an application's installed status."
date: 2026-10-28
source: "rrr: AunauN Oracle / Lumina"
concepts: [video, storyboard, thai-tts, local-ai, model-cache, licensing]
---

# Voice-led editing and model readiness

1. Probe the actual narration, locate phrase timing, then map relevant verified footage to it. Automatic transcription and sampled frames are aids: they do not establish pronunciation, smoothness or musical rights without listening and viewing.
2. Record the user’s stylistic and accessibility choices explicitly: this task requested Thai male narration, ambient sound, 9:16 and no onscreen captions. A technical checker may report missing captions even when intentionally omitted.
3. An app's model catalogue may report installed while a complete Hugging Face snapshot is missing. Inspect the backend error, confirm required files, repair the cache without deleting existing data, and test a real generation; do not infer model readiness from a listing alone.
4. VoiceStudio is the application; OmniVoice is one selected engine. Application licence, model weights, component licences, source voices, incidental music and permission for commercial output are separate checks. OmniVoice's default weights are noncommercial according to its notice; do not present a promotional cut as cleared for publication.
