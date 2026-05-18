import { HeroBlock as HeroBlockType } from "@/lib/landing-page-api";
import LeadCaptureForm from "@/components/LeadCaptureForm";

type Props = {
  block: HeroBlockType;
};

const HeroBlock = ({ block }: Props) => (
  <section className="bg-[#570000] py-16 px-6">
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-center justify-between">
      <div className="lg:flex-1">
        <h1 className="text-4xl lg:text-[3.5rem] font-extrabold text-[#ffe8f3] uppercase leading-8 lg:leading-none">
          {block.heading}
        </h1>
        {block.subheading && (
          <p className="text-white mt-3 text-base lg:text-lg leading-6 sm:leading-tight">
            {block.subheading}
          </p>
        )}
      </div>
      <div className="lg:flex-1 w-full">
        <LeadCaptureForm />
      </div>
    </div>
  </section>
);

export default HeroBlock;
