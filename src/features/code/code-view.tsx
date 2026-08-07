import { PageHero } from "@/components/shared/page-hero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const generationCode = `from PIL import Image, ImageDraw
import cv2
import hashlib
import numpy as np
import sys

VIDEO_FPS = 60

def random_generator(init_seed):
    if init_seed.startswith("0x"):
        init_seed = init_seed[2:]
    init_seed = bytes.fromhex(init_seed)
    seed = init_seed

    while True:
        m = hashlib.sha3_256()
        m.update(init_seed)
        m.update(seed)
        seed = m.digest()
        for b in seed:
            for i in range(8):
                yield (b >> i) & 1

def random_int(largest, gen):
    num = 0
    for _ in range(256):
        num = (num << 1) + next(gen)
    return num % largest`;

export function CodeView() {
  return (
    <div className="space-y-10">
      <PageHero
        description="The original generation script remains part of the experience. This view keeps the code front and center while the rest of the app modernizes around it."
        eyebrow="Generation Script"
        title={
          <>
            TOKEN <span className="text-accent">CODE</span>
          </>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Python generation excerpt</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="border-border overflow-x-auto rounded-[1.5rem] border bg-black/50 p-6 text-sm leading-7 text-slate-200">
            <code>{generationCode}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
