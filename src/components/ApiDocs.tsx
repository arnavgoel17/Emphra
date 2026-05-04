"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Check, Terminal } from "lucide-react";

const codeExamples = {
  javascript: `const response = await fetch('https://api.emphra.com/v1/moderate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "This API is absolutely game-changing!",
    strictness: "medium"
  })
});

const data = await response.json();
console.log(data.action); // "allow"`,
  python: `import requests

url = "https://api.emphra.com/v1/moderate"
payload = {
    "text": "This API is absolutely game-changing!",
    "strictness": "medium"
}
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json()['action']) # "allow"`,
  curl: `curl -X POST https://api.emphra.com/v1/moderate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "This API is absolutely game-changing!",
    "strictness": "medium"
  }'`
};

export function ApiDocs() {
  const [activeTab, setActiveTab] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="docs" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tighter mb-8"
            >
              Integrate in <span className="text-primary-gradient">minutes.</span> Not days.
            </motion.h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Emphra is built for developers. Our REST API is designed to be 
              plug-and-play with any chat platform, community app, or marketplace.
            </p>
            <ul className="space-y-4">
              {["Single POST endpoint for all features", "SDKs for Node.js, Python, and Go", "99.99% Uptime SLA", "PCI & SOC2 Type II Compliant"].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-white font-medium">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="text-primary w-3 h-3" strokeWidth={4} />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="bg-white/5 p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal size={18} className="text-muted-foreground" />
                <span className="text-xs font-bold text-white uppercase tracking-widest">Interactive Docs</span>
              </div>
              <button 
                onClick={copyCode} 
                suppressHydrationWarning
                className="text-muted-foreground hover:text-white transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
            
            <Tabs defaultValue="javascript" onValueChange={setActiveTab}>
              <div className="bg-black/40 px-4 pt-2">
                <TabsList className="bg-transparent h-10 gap-4">
                  <TabsTrigger value="javascript" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-lg rounded-b-none border-0">JS</TabsTrigger>
                  <TabsTrigger value="python" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-lg rounded-b-none border-0">Python</TabsTrigger>
                  <TabsTrigger value="curl" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-t-lg rounded-b-none border-0">cURL</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="javascript" className="m-0">
                <pre className="p-6 text-sm font-mono text-cyan-400 bg-black/60 overflow-x-auto h-[350px]">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </TabsContent>
              <TabsContent value="python" className="m-0">
                <pre className="p-6 text-sm font-mono text-cyan-400 bg-black/60 overflow-x-auto h-[350px]">
                  <code>{codeExamples.python}</code>
                </pre>
              </TabsContent>
              <TabsContent value="curl" className="m-0">
                <pre className="p-6 text-sm font-mono text-cyan-400 bg-black/60 overflow-x-auto h-[350px]">
                  <code>{codeExamples.curl}</code>
                </pre>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
