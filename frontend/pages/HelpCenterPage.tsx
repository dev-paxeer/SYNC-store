import { useState } from 'react';
import { Search, LifeBuoy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I submit an app?',
    answer: 'To submit an app, you must first register as a developer. Once registered, you can access the Developer Dashboard and use the "Submit New App" feature. Follow the multi-step submission form to provide all necessary details about your app.'
  },
  {
    question: 'What are the requirements for an app to be approved?',
    answer: 'All apps must adhere to our Community Guidelines. We review apps for security, functionality, and content. Ensure your app is stable, provides a good user experience, and does not contain any prohibited content.'
  },
  {
    question: 'How do I become a developer?',
    answer: 'Currently, developer access is granted on a case-by-case basis. Please contact our support team with information about your project to request developer access.'
  },
  {
    question: 'How does revenue sharing work?',
    answer: 'Revenue sharing details are outlined in our Developer Agreement, which you agree to when submitting your first app. Generally, we offer a competitive revenue split. You can track your earnings in the Developer Dashboard.'
  },
  {
    question: 'How can I report a problem with an app?',
    answer: 'On each app\'s detail page, you can find a "Report Issue" option in the menu. Please provide as much detail as possible when reporting an issue so our team can investigate it thoroughly.'
  },
  {
    question: 'Is Web3Store secure?',
    answer: 'Security is our top priority. We perform automated and manual reviews of all app submissions. We also encourage users to be cautious and do their own research before installing any application.'
  }
];

export function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <LifeBuoy className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h1 className="text-3xl font-bold text-foreground mb-2">Help Center</h1>
        <p className="text-muted-foreground">
          Find answers to your questions and get help with Web3Store.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 h-12 text-lg bg-muted/50 border-0 focus-visible:ring-2 focus-visible:ring-ring rounded-2xl"
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No results found for "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}
