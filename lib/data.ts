export const decades = [
  {
    id: '2000s',
    title: 'Pop Culture Goes Mainstream',
    note: 'A whole new connection',
    color: '#86dce9',
    description:
      'The 2000s brought a wave of Filipino pop music, teen icons, local films, and the early rise of the internet. This era shaped a new generation and strengthened modern Filipino identity.',
    objects: [
      'Song',
      'Teen television',
      'Y2K streetwear',
      'Internet café afternoons',
      'After-school merienda',
      'Texting & Friendster',
      'Barkada memories',
    ],
  },
  {
    id: '2010s',
    title: 'The Digital Generation',
    note: 'Always online, all together',
    color: '#e09ab8',
    description:
      'Playlists replaced mixtapes, stories traveled through social feeds, and Filipino creativity found a bigger stage. A decade of connections, new voices, and shared moments.',
    objects: [
      'Indie playlists',
      'Streaming stories',
      'Streetwear culture',
      'Mobile game nights',
      'Milk tea dates',
      'The smartphone era',
      'Stories on our feeds',
    ],
  },
  {
    id: '2020s',
    title: 'A New Normal, New Voices',
    note: 'Our story is still unfolding',
    color: '#a9b7ef',
    description:
      'From bedroom studios to global communities, a new generation is making its mark. Discover the everyday creativity that keeps Filipino culture moving forward.',
    objects: [
      'P-pop & new voices',
      'Stories on demand',
      'Thrifted style',
      'Connected play',
      'Home café culture',
      'Short-form creativity',
      'Communities without borders',
    ],
  },
] as const;

export const categories = [
  'Music',
  'TV & Film',
  'Fashion',
  'Games & Sports',
  'Food',
  'Technology',
  'Lifestyle',
] as const;

export type Category = (typeof categories)[number];

export type Exhibit = {
  title: string;
  description: string;
  art: string;
  tag: string;
  year: string;
  image: string;
  imageCredit: string;
  imageCreditUrl: string;
};

export const yearRanges: Record<string, [string, string, string]> = {
  '2000s': ['2000–2002', '2003–2006', '2007–2009'],
  '2010s': ['2010–2012', '2013–2016', '2017–2019'],
  '2020s': ['2020–2022', '2023–2026', 'Now & next'],
};

const stories: Record<
  Category,
  string[]
> = {
  Music: [
    'Christmas Songs',
    'Graduation, Moving-up & Recognition Ceremony Songs',
    'Birthday Parties, Fiestas, and Family Gathering Songs',
    'Christmas Bonus Aegis (2000)',
    'Bro, Ikaw ang star ng pasko ABS-CBN (2009)',
    'Bakit Papa? - SexBonb Girls (2002)',
    'Salamat - Yeng Constantino (2000)',
    'Glowing Inside - Nikki Girl',
    'Karaoke Culture',
    'Hawak Kamay - Yeng Constantino',
    'Otso-Otso - Bayani Agbayani',
    'The Spagetti Song - SexBomb Girls',
    'Pamela One - Vhong Navarro',
    'Pinoy Ako - Orange & Lemons',
    'Totoy Bibo - Vhong Navarro'
  ],
  'TV & Film': [
    'Primetime Memories',
    'Big-screen Barkada',
    'Weekend Movie Night',
    'The Afternoon Habit',
    'Favorite screen characters',
    'Stories watched together',
  ],
  Fashion: [
    'Denim days',
    'Statement Accessories',
    'Campus Style',
    'Your Favorite Sneakers',
    'Looks saved for later',
    'Everyday personal style',
  ],
  'Games & Sports': [
    'Street games',
    'Neighborhood basketball',
    'After-school Adventures',
    'Internet Café Days',
    'Play with the Barkada',
    'Friendly rivalries',
  ],
  Food: [
    'Merienda Moments',
    'Sari-sari Favorites',
    'Family Celebrations',
    'After-school snacks',
    'Late-night Comforts',
    'Recipes shared at home',
  ],
  Technology: [
    'The family telephone',
    'Text Culture',
    'Our First Profiles',
    'The Family Computer',
    'Pocket-size Memories',
    'Always-on connections',
  ],
  Lifestyle: [
    'Barkada Hangouts',
    'The Daily Commute',
    'School-day Stories',
    'Fiesta Spirit',
    'Weekend routines',
    'Little everyday rituals',
  ],
};

const descriptions: Record<Category, string[]> = {
  Music: [
    'Christmas songs filled homes, classrooms, and neighborhood gatherings with melodies that made the season feel shared.',
    'Graduation, moving-up, and recognition ceremony songs gave important milestones a soundtrack of pride, gratitude, and new beginnings.',
    'Birthday parties, fiestas, and family gathering songs brought people together through familiar choruses, dancing, and celebration.',
    'Christmas Bonus by Aegis captured the playful warmth of Filipino holiday music and the excitement of hearing a favorite seasonal song.',
    'Bro, Ikaw ang Star ng Pasko became a memorable holiday anthem that connected families through a shared Christmas message.',
    'Bakit Papa? became a playful pop memory, remembered for its catchy hook and the energy it brought to group sing-alongs.',
    'Salamat by Yeng Constantino carried the feeling of appreciation, making it a natural soundtrack for friendships and heartfelt dedications.',
    'Glowing Inside became a reflective song for listeners growing up, finding confidence, and holding on to hopeful memories.',
    'Karaoke culture made every gathering a stage, whether the performance was polished or wonderfully off-key.',
    'Hawak Kamay became a reassuring reminder of friendship, support, and staying close through changing seasons of life.',
    'Otso-Otso brought a playful, dance-ready energy to parties and helped turn a familiar song into a shared celebration.',
    'The Spaghetti Song became a lighthearted party favorite, remembered for its humor, movement, and instantly recognizable refrain.',
    'Pamela One added a cheeky, upbeat moment to the soundtrack of Filipino gatherings and nostalgic sing-alongs.',
    'Pinoy Ako celebrated local identity and belonging, giving listeners a song that felt proud, lively, and unmistakably Filipino.',
    'Totoy Bibo brought playful energy to family events, where its fun rhythm made it easy for everyone to join in.',
  ],
  'TV & Film': [
    'Primetime shows gave families a familiar ritual, bringing everyone together around the same characters and cliffhangers.',
    'Big-screen barkada trips turned movie theaters into places for shared jokes, snacks, and unforgettable weekends.',
    'Weekend movie nights made a simple living room feel like a private cinema full of comfort and conversation.',
    'The afternoon habit filled quiet hours with favorite programs, theme songs, and stories we could quote together.',
    'Favorite screen characters stayed with us long after the credits, shaping the way we saw friendship, love, and courage.',
    'Stories watched together became shared references that could bring a whole group back to the same moment.',
  ],
  Fashion: [
    'Denim days made reliable staples feel personal through the way they were styled, patched, and worn again and again.',
    'Statement accessories added color and confidence to everyday outfits, turning small details into conversation starters.',
    'Campus style mixed practicality with self-expression as students found ways to make familiar pieces their own.',
    'Favorite sneakers carried us through school days, long walks, and the small adventures that filled a week.',
    'Looks saved for later captured the excitement of discovering new inspiration and imagining how it might fit our lives.',
    'Everyday personal style grew from local creativity, changing trends, and the details that made an outfit feel like us.',
  ],
  'Games & Sports': [
    'Street games turned sidewalks and open spaces into playgrounds where everyone could join in after school.',
    'Neighborhood basketball brought friendly competition, teamwork, and a reason to stay outside until sunset.',
    'After-school adventures began with a quick game and often became a full afternoon of stories with friends.',
    'Internet café days introduced shared screens, noisy victories, and new friendships built one round at a time.',
    'Playing with the barkada made even familiar games feel different because the best part was who was there.',
    'Friendly rivalries kept the energy high, turning small contests into stories that were retold for years.',
  ],
  Food: [
    'Merienda moments gave busy days a pause, filled with familiar snacks and conversations that lasted longer than planned.',
    'Sari-sari store favorites connected neighborhoods through small treats, quick errands, and the joy of choosing something sweet.',
    'Family celebrations gathered people around dishes that made important days feel generous, warm, and complete.',
    'After-school snacks were simple rewards that made the walk home feel shorter and the day a little brighter.',
    'Late-night comforts offered warmth and familiarity when the house was quiet and everyone needed something reassuring.',
    'Recipes shared at home carried family knowledge forward, keeping memories alive through taste, smell, and repetition.',
  ],
  Technology: [
    'The family telephone was a shared doorway to the outside world, with everyone listening for news from someone they loved.',
    'Text culture made short messages feel powerful, letting friends stay close through quick updates and playful codes.',
    'Our first profiles introduced a new way to present ourselves, collect memories, and find people with shared interests.',
    'The family computer became a gathering point for homework, games, music, and the first steps into the wider internet.',
    'Pocket-size memories put cameras, music, messages, and maps into our hands wherever the day took us.',
    'Always-on connections made it easier to share a moment instantly, while changing how we understood togetherness.',
  ],
  Lifestyle: [
    'Barkada hangouts turned ordinary free time into a collection of inside jokes, shared meals, and stories worth keeping.',
    'The daily commute became its own rhythm of familiar routes, passing faces, and small observations made along the way.',
    'School-day stories grew from routines, friendships, and the unexpected moments that made a normal day memorable.',
    'Fiesta spirit filled communities with color, welcome, music, and the feeling that everyone had a place in the celebration.',
    'Weekend routines created space for rest, errands, visits, and the simple rituals that helped a week feel complete.',
    'Little everyday rituals are the quiet habits that turn a place, a person, or a season into something we remember fondly.',
  ],
};

const imageSources: Record<
  Category,
  { url: string; credit: string; creditUrl: string }
> = {
  Music: {
    url: '/band.png',
    credit: 'Digital Museum collage',
    creditUrl: '/collage.png',
  },
  'TV & Film': {
    url: '/karaoke.png',
    credit: 'Digital Museum collage',
    creditUrl: '/collage.png',
  },
  Fashion: {
    url: 'https://images.unsplash.com/photo-1525562723836-dca67a71d5f1?auto=format&fit=crop&w=1200&q=85',
    credit: 'Cam Morin / Unsplash',
    creditUrl:
      'https://unsplash.com/photos/woman-standing-selecting-clothes-knKm7u_7Ihw',
  },
  'Games & Sports': {
    url: 'https://images.unsplash.com/photo-1519684093736-61f49e250672?auto=format&fit=crop&w=1200&q=85',
    credit: 'John Branch IV / Unsplash',
    creditUrl:
      'https://unsplash.com/photos/grayscale-photo-of-group-of-men-playing-street-basketball-GoK7-pch12s',
  },
  Food: {
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/%22Kakaning_Pinoy%22_%28The_Filipino_Rice_Cakes%29.jpg',
    credit: 'Robertmarrel / Wikimedia Commons, CC BY-SA 4.0',
    creditUrl:
      'https://commons.wikimedia.org/wiki/File:%22Kakaning_Pinoy%22_(The_Filipino_Rice_Cakes).jpg',
  },
  Technology: {
    url: 'https://images.unsplash.com/photo-1632154131780-93817e5beb2e?auto=format&fit=crop&w=1200&q=85',
    credit: 'Han Wen / Unsplash',
    creditUrl:
      'https://unsplash.com/photos/a-person-sitting-at-a-desk-with-two-laptops-1ZHvbXBNwaI',
  },
  Lifestyle: {
    url: 'https://images.unsplash.com/photo-1753351055246-a7efae066eef?auto=format&fit=crop&w=1200&q=85',
    credit: 'Vitaly Gariev / Unsplash',
    creditUrl:
      'https://unsplash.com/photos/friends-are-chatting-and-having-coffee-at-a-cafe-rioA77g2-XU',
  },
};

export function getExhibits(
  decade: string,
  category: Category,
  period = 0,
): Exhibit[] {
  const era = decades.find((item) => item.id === decade)!;
  const range = yearRanges[decade][period];
  const source = imageSources[category];

  return stories[category]
    .slice(period * 2, period * 2 + 2)
    .map((title, index) => {
      const object = era.objects[categories.indexOf(category)];
      const description = descriptions[category][period * 2 + index];

      return {
        title: `${object}: ${title}`,
        description: `${description} During ${range}, ${object.toLowerCase()} became part of the everyday moments remembered from the ${decade}.`,
        art: ['band', 'singer', 'mixtape', 'karaoke'][period * 2 + index],
        tag: `${decade} · ${category}`,
        year: range,
        image: source.url,
        imageCredit: source.credit,
        imageCreditUrl: source.creditUrl,
      };
    });
}
