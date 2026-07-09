export interface Testimonial {
  quote: string;
  attribution: string;
  /** Shown in the homepage's featured selection (student + parent voices,
   * three different schools), in addition to the full /testimonials page. */
  featured?: boolean;
  /** Short pull for the homepage — always a verbatim cut of `quote` (an
   * ellipsis may bridge two cuts); the full quote lives on /testimonials. */
  excerpt?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: `Alison helped me write my main college application essay. Trying to finish it before the start of my senior year of high school was difficult. Alison helped me compile all of my messy first drafts into the essay I am most proud to have written. She was patient with me and provided amazing advice and support while also making sure that it was MY essay, with words coming from me. Overall her help guided me to the final draft of my essay, the best essay I have ever written. She was such an amazing help!`,
    attribution: 'Emma G. — University of Wisconsin-Madison, Class of 2024',
    featured: true,
    excerpt:
      'Alison helped me compile all of my messy first drafts into the essay I am most proud to have written. She was patient with me and provided amazing advice and support while also making sure that it was MY essay, with words coming from me.',
  },
  {
    quote: `Owen is so excited to attend South Carolina. It was down to the wire so to speak. We finally got to visit USC in April and he loved it! He was also accepted to Chapman into the film school and he felt very proud about that, but ultimately USC had a lot of what he wanted and it is near family in the Carolinas, he loves that too. Cannot thank you enough for how much you helped him, and I have told many friends and family how wonderful you were to work with. I recommend you to everyone! Thank you again!`,
    attribution: 'Judy C., Parent — Class of 2026',
    featured: true,
    excerpt:
      'Cannot thank you enough for how much you helped him, and I have told many friends and family how wonderful you were to work with. I recommend you to everyone!',
  },
  {
    quote: `Alison's advice and guidance as I wrote my medical school personal statement helped me clarify the story I was struggling to tell. She improved my repetitive vocabulary and sentence structure while staying true to my narrative voice. She helped me describe my strengths and support them with concrete stories, a crucial part of an admissions essay. Alison also made collaborating remotely very easy. Her thoughtful comments and edits on my statement demonstrated the time and effort she puts in with her clients. I am grateful for Alison's wisdom and guidance during this process and will certainly use her for my writing in the future.`,
    attribution: 'Allie K. — University of Virginia, Kinesiology Major, Class of 2020',
  },
  {
    quote: `I had an amazing experience working with Alison on my common app essay. She was able to help me brainstorm ideas. Once we found one that worked I was able to draw it out into a finalized essay with her assistance. We were able to work together to properly portray the message I was going for. She was a great help with every step of the essay writing process. I could not thank her more for her professional insight.`,
    attribution: 'Carter S. — Franklin & Marshall College, Class of 2023',
  },
  {
    quote: `As a parent navigating college admissions for the first time, there are so many unknowns and a tremendous amount to accomplish to feel confidently that you have supported your child the best way you can. Our choice to work with Alison on the essay portion was both a huge relief and a super effective way to stay on track. It was a reasonable investment for what turned out to be a great pay off. Removing myself from that particular process was healthy and super productive.`,
    attribution: 'Holly G., Parent',
  },
  {
    quote: `Alison helped me write two essays for my college application. She taught me what colleges are looking for in an essay and helped me expand my ideas. After we brainstormed ideas, we organized the essay and rearranged the paragraphs. Finally, we edited and improved the syntax. After two individual meetings, Alison and I were in touch via email making any finishing touches on the paper. I have been accepted into both of the schools I applied to using the essay.`,
    attribution: 'Max M. — University of Maryland, College Park, Class of 2020',
    featured: true,
    excerpt:
      'She taught me what colleges are looking for in an essay and helped me expand my ideas. … I have been accepted into both of the schools I applied to using the essay.',
  },
  {
    quote: `Alison helped me find the experiences in my past that best answered the question who am I? Through many meetings Alison helped me narrow down all the ideas I had for an essay, which college admissions officers would want to read, and together Alison and I created a formal, concise essay that showed admissions officers who I am and why I would succeed in college. We worked through many drafts, editing for content and grammar, until we eventually arrived at a final draft which helped me get into the school I have happily spent the last three years at. Alison was vital in helping me craft a good college essay.`,
    attribution: 'Nathan K. — Clark University, Class of 2022',
  },
  {
    quote: `The Coach called us on Friday. David has been accepted to Franklin and Marshall and he has a spot on the wrestling team! It must have been the great essay that put him over the top! We are very happy and excited. Thank you for all your help. His writing has improved and now he has the skills to finish the year off strong.`,
    attribution: 'David B. — Franklin & Marshall College, Class of 2018',
  },
];
