export const decades = [
  { id:'1990s', title:'Foundations & Identity', note:'The mixtape years', color:'#c99461', description:'From cassette mixtapes to afternoon television, a generation found its voice in homegrown music, neighborhood games, and everyday rituals.', objects:['Cassette mixtapes','Afternoon cartoons','Denim days','Street games','Sari-sari treats','The family telephone','Jeepney journeys'] },
  { id:'2000s', title:'Pop Culture Goes Mainstream', note:'A whole new connection', color:'#86dce9', description:'The 2000s brought a wave of Filipino pop music, teen icons, local films, and the early rise of the internet. This era shaped a new generation and strengthened modern Filipino identity.', objects:['OPM Bands','Teen television','Y2K streetwear','Internet café afternoons','After-school merienda','Texting & Friendster','Barkada memories'] },
  { id:'2010s', title:'The Digital Generation', note:'Always online, all together', color:'#e09ab8', description:'Playlists replaced mixtapes, stories traveled through social feeds, and Filipino creativity found a bigger stage. A decade of connections, new voices, and shared moments.', objects:['Indie playlists','Streaming stories','Streetwear culture','Mobile game nights','Milk tea dates','The smartphone era','Stories on our feeds'] },
  { id:'2020s', title:'A New Normal, New Voices', note:'Our story is still unfolding', color:'#a9b7ef', description:'From bedroom studios to global communities, a new generation is making its mark. Discover the everyday creativity that keeps Filipino culture moving forward.', objects:['P-pop & new voices','Stories on demand','Thrifted style','Connected play','Home café culture','Short-form creativity','Communities without borders'] },
] as const;
export const categories = ['Music','TV & Film','Fashion','Games & Sports','Food','Technology','Lifestyle'] as const;
export type Category = typeof categories[number];
export type Exhibit = { title:string; description:string; art:string; tag:string };
const stories: Record<Category, [string,string,string,string]> = {
 'Music':['OPM Bands','Pop Icons','R&B and Hip-hop','Karaoke Culture'],
 'TV & Film':['Primetime Memories','Big-screen Barkada','Weekend Movie Night','The Afternoon Habit'],
 'Fashion':['Denim Everywhere','Statement Accessories','Campus Style','Your Favorite Sneakers'],
 'Games & Sports':['Internet Café Days','Street Basketball','After-school Adventures','Play with the Barkada'],
 'Food':['Merienda Moments','Sari-sari Favorites','Family Celebrations','Late-night Comforts'],
 'Technology':['Text Culture','Our First Profiles','The Family Computer','Pocket-size Memories'],
 'Lifestyle':['Barkada Hangouts','The Daily Commute','School-day Stories','Fiesta Spirit']
};
const descriptions: Record<Category,string> = {
 'Music':'From songs on the radio to a chorus shared with friends, music became the soundtrack to ordinary days. These are the sounds that bring us back.',
 'TV & Film':'Families gathered around the screen, following familiar faces and stories that became part of everyday conversation.',
 'Fashion':'Personal style mixed global inspiration with local creativity. The clothes, colors, and little details tell their own stories.',
 'Games & Sports':'A shared game could turn a neighborhood street or an internet café into a place of friendship and friendly rivalry.',
 'Food':'An afternoon snack, a family recipe, a familiar neighborhood store: the flavors we remember are inseparable from the people around us.',
 'Technology':'Every new device changed how we kept in touch. Small screens carried big feelings, inside jokes, and our first digital identities.',
 'Lifestyle':'Culture lives in the everyday: the journey home, time with the barkada, and traditions passed from one generation to the next.'
};
export function getExhibits(decade:string, category:Category):Exhibit[] {
 const era=decades.find(d=>d.id===decade)!;
 return stories[category].map((title,i)=>({title: i===0&&decade!=='2000s'?era.objects[categories.indexOf(category)]:title,description:descriptions[category],art:['band','singer','mixtape','karaoke'][i],tag:`${decade} · ${category}`}));
}
