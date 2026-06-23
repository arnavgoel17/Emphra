"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check, ArrowRight } from "lucide-react";

const codeExamples = {
  javascript: `import { Emphra } from "@emphra/sdk";

const emphra = new Emphra({ apiKey: process.env.EMPRA_API_KEY });

const result = await emphra.moderate({
  text: "Hello, this is a great platform!",
  context: { userId: "usr_123", channelId: "ch_456" }
});

console.log(result.action); // "allow"
console.log(result.confidence); // 0.98`,

  python: `from emphra import Emphra

emphra = Emphra(api_key=os.environ["EMPRA_API_KEY"])

result = emphra.moderate(
    text="Hello, this is a great platform!",
    context={"user_id": "usr_123", "channel_id": "ch_456"}
)

print(result.action)  # "allow"
print(result.confidence)  # 0.98`,

  java: `import com.emphra.Emphra;
import com.emphra.ModerateRequest;

Emphra emphra = new Emphra(System.getenv("EMPRA_API_KEY"));

ModerateRequest request = ModerateRequest.builder()
    .text("Hello, this is a great platform!")
    .context(Map.of("userId", "usr_123", "channelId", "ch_456"))
    .build();

ModerateResult result = emphra.moderate(request);
System.out.println(result.getAction()); // "allow"
System.out.println(result.getConfidence()); // 0.98`,
};

const responseExample = `{
  "id": "mod_7f8a9b2c",
  "action": "allow",
  "confidence": 0.98,
  "categories": {
    "toxicity": 0.02,
    "spam": 0.01,
    "hate_speech": 0.0
  },
  "processing_time_ms": 23
}`;

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-xs font-medium uppercase tracking-[0.2em] text-gold mb-4"
            >
              Documentation
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-heading)]"
            >
              <span className="text-ivory-gradient">Ship in minutes,</span>
              <br />
              <span className="text-foreground/40">not sprints.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              A single REST endpoint. SDKs for every major language. Comprehensive docs with examples for every use case.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                "Single POST endpoint for all features",
                "TypeScript, Python, Java, and Go SDKs",
                "99.99% uptime SLA with global edge",
                "SOC2 Type II and GDPR compliant",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {item}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-8"
            >
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-gold hover:text-gold/80 transition-colors group"
              >
                View full API reference
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[oklch(0.06_0.01_260)] shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
                <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                Request
              </span>
              <button
                onClick={copyCode}
                className="text-muted-foreground/50 hover:text-foreground transition-colors duration-300"
                aria-label="Copy code"
              >
                {copied ? <Check size={14} className="text-gold" /> : <Copy size={14} />}
              </button>
            </div>

            <Tabs defaultValue="javascript" onValueChange={setActiveTab}>
              <div className="px-4 pt-3 border-b border-white/[0.04]">
                <TabsList className="bg-transparent h-8 gap-1 p-0">
                  {(["javascript", "python", "java"] as const).map((lang) => (
                    <TabsTrigger
                      key={lang}
                      value={lang}
                      className="text-xs text-muted-foreground/50 data-[state=active]:text-foreground data-[state=active]:bg-white/[0.06] rounded-md px-3 py-1 capitalize"
                    >
                      {lang === "javascript" ? "JavaScript" : lang === "python" ? "Python" : "Java"}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value="javascript" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </TabsContent>
              <TabsContent value="python" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.python}</code>
                </pre>
              </TabsContent>
              <TabsContent value="java" className="m-0">
                <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/60 overflow-x-auto">
                  <code>{codeExamples.java}</code>
                </pre>
              </TabsContent>
            </Tabs>

            <div className="border-t border-white/[0.06]">
              <div className="px-5 py-2 border-b border-white/[0.04] bg-white/[0.01]">
                <span className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                  Response
                </span>
              </div>
              <pre className="p-5 text-[13px] leading-relaxed font-mono text-foreground/40 overflow-x-auto">
                <code>{responseExample}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
