import { withBase } from '../lib/withBase';

export interface School {
  name: string;
  logo: string;
  alt: string;
  /** Each SVG's native viewBox aspect ratio, so <img> can reserve its box
   * before load instead of shifting the marquee layout once it resolves. */
  width: number;
  height: number;
}

export const schools: School[] = [
  { name: 'University of Texas at Austin', logo: withBase('/logos/schools/ut-austin.svg'), alt: 'University of Texas at Austin logo', width: 350, height: 100 },
  { name: 'University of Wisconsin-Madison', logo: withBase('/logos/schools/wisconsin-madison.svg'), alt: 'University of Wisconsin-Madison logo', width: 367, height: 123.6 },
  { name: 'University of Michigan', logo: withBase('/logos/schools/michigan.svg'), alt: 'University of Michigan logo', width: 372.6, height: 72 },
  { name: 'Chapman University', logo: withBase('/logos/schools/chapman.svg'), alt: 'Chapman University logo', width: 375.5, height: 71.8 },
  { name: 'University of Maryland, College Park', logo: withBase('/logos/schools/maryland.svg'), alt: 'University of Maryland, College Park logo', width: 277, height: 55 },
  { name: 'U.S. Merchant Marine Academy', logo: withBase('/logos/schools/usmma.svg'), alt: 'U.S. Merchant Marine Academy logo', width: 380.4, height: 89.1 },
  { name: 'University of South Carolina', logo: withBase('/logos/schools/south-carolina.svg'), alt: 'University of South Carolina logo', width: 800, height: 408 },
  { name: 'University of Virginia', logo: withBase('/logos/schools/virginia.svg'), alt: 'University of Virginia logo', width: 202, height: 197 },
  { name: 'Franklin & Marshall College', logo: withBase('/logos/schools/franklin-marshall.svg'), alt: 'Franklin & Marshall College logo', width: 387, height: 73 },
  { name: 'Clark University', logo: withBase('/logos/schools/clark.svg'), alt: 'Clark University logo', width: 209, height: 71 },
];
