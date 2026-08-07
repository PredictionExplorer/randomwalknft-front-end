import { PageHero } from "@/components/shared/page-hero";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    answer:
      "Connect a wallet on Arbitrum, head to the Mint page, and confirm the transaction. The frontend then triggers the media-generation backend and tracks the token detail page state.",
    question: "How do I mint Random Walk NFTs?",
  },
  {
    answer:
      "All minting and marketplace actions are designed for Arbitrum One. The wallet flow prompts users to switch networks when they connect from the wrong chain.",
    question: "Which network does the site support?",
  },
  {
    answer:
      "The built-in marketplace remains fee-free. Listings and buy offers are surfaced directly from the market contract and refreshed through server-backed query endpoints.",
    question: "What is the fee for buying and selling?",
  },
  {
    answer:
      "Image and video assets are derived from the on-chain seed generated at mint time. The detail page preserves the original deep links for black/white themes and single/triple video variants.",
    question: "How are the images and videos generated?",
  },
  {
    answer:
      "When there has not been a mint for the configured withdrawal period, the last minter becomes eligible to redeem a portion of the contract balance through the Redeem page.",
    question: "How does redeeming work?",
  },
];

export function FaqList() {
  return (
    <div className="space-y-10">
      <PageHero
        description="The operational details behind minting, media generation, marketplace behavior, and the redeem mechanic."
        eyebrow="Documentation"
        title={
          <>
            PRODUCT <span className="text-accent">FAQ</span>
          </>
        }
      />
      <Accordion className="space-y-4" collapsible type="single">
        {faqItems.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
