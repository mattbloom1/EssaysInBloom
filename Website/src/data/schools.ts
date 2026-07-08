import { withBase } from '../lib/withBase';

export interface School {
  name: string;
  logo: string;
  alt: string;
}

export const schools: School[] = [
  { name: 'University of Texas at Austin', logo: withBase('/logos/schools/ut-austin.svg'), alt: 'University of Texas at Austin logo' },
  { name: 'University of Wisconsin-Madison', logo: withBase('/logos/schools/wisconsin-madison.svg'), alt: 'University of Wisconsin-Madison logo' },
  { name: 'University of Michigan', logo: withBase('/logos/schools/michigan.svg'), alt: 'University of Michigan logo' },
  { name: 'Chapman University', logo: withBase('/logos/schools/chapman.svg'), alt: 'Chapman University logo' },
  { name: 'University of Maryland, College Park', logo: withBase('/logos/schools/maryland.svg'), alt: 'University of Maryland, College Park logo' },
  { name: 'U.S. Merchant Marine Academy', logo: withBase('/logos/schools/usmma.svg'), alt: 'U.S. Merchant Marine Academy logo' },
  { name: 'University of South Carolina', logo: withBase('/logos/schools/south-carolina.svg'), alt: 'University of South Carolina logo' },
  { name: 'University of Virginia', logo: withBase('/logos/schools/virginia.svg'), alt: 'University of Virginia logo' },
  { name: 'Franklin & Marshall College', logo: withBase('/logos/schools/franklin-marshall.svg'), alt: 'Franklin & Marshall College logo' },
  { name: 'Clark University', logo: withBase('/logos/schools/clark.svg'), alt: 'Clark University logo' },
];
