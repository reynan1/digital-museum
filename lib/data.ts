export const decades = [
  { id:'1990s', title:'Foundations & Identity', note:'The mixtape years', color:'#c99461', description:'From cassette mixtapes to afternoon television, a generation found its voice in homegrown music, neighborhood games, and everyday rituals.', objects:['Cassette mixtapes','Afternoon cartoons','Denim days','Street games','Sari-sari treats','The family telephone','Jeepney journeys'] },
  { id:'2000s', title:'Pop Culture Goes Mainstream', note:'A whole new connection', color:'#86dce9', description:'The 2000s brought a wave of Filipino pop music, teen icons, local films, and the early rise of the internet. This era shaped a new generation and strengthened modern Filipino identity.', objects:['OPM Bands','Teen television','Y2K streetwear','Internet café afternoons','After-school merienda','Texting & Friendster','Barkada memories'] },
  { id:'2010s', title:'The Digital Generation', note:'Always online, all together', color:'#e09ab8', description:'Playlists replaced mixtapes, stories traveled through social feeds, and Filipino creativity found a bigger stage. A decade of connections, new voices, and shared moments.', objects:['Indie playlists','Streaming stories','Streetwear culture','Mobile game nights','Milk tea dates','The smartphone era','Stories on our feeds'] },
  { id:'2020s', title:'A New Normal, New Voices', note:'Our story is still unfolding', color:'#a9b7ef', description:'From bedroom studios to global communities, a new generation is making its mark. Discover the everyday creativity that keeps Filipino culture moving forward.', objects:['P-pop & new voices','Stories on demand','Thrifted style','Connected play','Home café culture','Short-form creativity','Communities without borders'] },
] as const;
export const categories = ['Music','TV & Film','Fashion','Games & Sports','Food','Technology','Lifestyle'] as const;
export type Category = typeof categories[number];
export type Exhibit = { title:string; description:string; art:string; tag:string; year:string; image:string; imageCredit:string; imageCreditUrl:string };
export const yearRanges: Record<string, [string,string,string]> = {
 '1990s':['1990–1992','1993–1996','1997–1999'],
 '2000s':['2000–2002','2003–2006','2007–2009'],
 '2010s':['2010–2012','2013–2016','2017–2019'],
 '2020s':['2020–2022','2023–2026','Now & next'],
};
const stories: Record<Category, [string,string,string,string,string,string]> = {
 'Music':['OPM on the radio','Pop Icons','Band posters & album sleeves','R&B and Hip-hop','Karaoke Culture','Songs shared with friends'],
 'TV & Film':['Primetime Memories','Big-screen Barkada','Weekend Movie Night','The Afternoon Habit','Favorite screen characters','Stories watched together'],
 'Fashion':['Denim days','Statement Accessories','Campus Style','Your Favorite Sneakers','Looks saved for later','Everyday personal style'],
 'Games & Sports':['Street games','Neighborhood basketball','After-school Adventures','Internet Café Days','Play with the Barkada','Friendly rivalries'],
 'Food':['Merienda Moments','Sari-sari Favorites','Family Celebrations','After-school snacks','Late-night Comforts','Recipes shared at home'],
 'Technology':['The family telephone','Text Culture','Our First Profiles','The Family Computer','Pocket-size Memories','Always-on connections'],
 'Lifestyle':['Barkada Hangouts','The Daily Commute','School-day Stories','Fiesta Spirit','Weekend routines','Little everyday rituals']
};
const descriptions: Record<Category,string> = {
 'Music':'From radio favorites and home karaoke to songs passed between friends, music gives ordinary days their own soundtrack.',
 'TV & Film':'Television and cinema brought people together around familiar characters, shared jokes, and stories worth retelling.',
 'Fashion':'Everyday outfits mix local creativity, changing trends, and the small details that make a look feel personal.',
 'Games & Sports':'Neighborhood games, friendly matches, and shared screens turn play into a way to spend time together.',
 'Food':'Merienda, sari-sari store favorites, and family recipes make food part of how we remember a place and its people.',
 'Technology':'From family telephones to pocket-sized screens, each new way to connect changes how people share a moment.',
 'Lifestyle':'The daily commute, barkada hangouts, school routines, and celebrations are culture lived in everyday life.'
};
const imageSources: Record<Category, { url:string; credit:string; creditUrl:string }> = {
 'Music':{url:'/band.png',credit:'Digital Museum collage',creditUrl:'/collage.png'},
 'TV & Film':{url:'/karaoke.png',credit:'Digital Museum collage',creditUrl:'/collage.png'},
 'Fashion':{url:'https://images.unsplash.com/photo-1525562723836-dca67a71d5f1?auto=format&fit=crop&w=1200&q=85',credit:'Cam Morin / Unsplash',creditUrl:'https://unsplash.com/photos/woman-standing-selecting-clothes-knKm7u_7Ihw'},
 'Games & Sports':{url:'https://images.unsplash.com/photo-1519684093736-61f49e250672?auto=format&fit=crop&w=1200&q=85',credit:'John Branch IV / Unsplash',creditUrl:'https://unsplash.com/photos/grayscale-photo-of-group-of-men-playing-street-basketball-GoK7-pch12s'},
 'Food':{url:'https://upload.wikimedia.org/wikipedia/commons/1/19/%22Kakaning_Pinoy%22_%28The_Filipino_Rice_Cakes%29.jpg',credit:'Robertmarrel / Wikimedia Commons, CC BY-SA 4.0',creditUrl:'https://commons.wikimedia.org/wiki/File:%22Kakaning_Pinoy%22_(The_Filipino_Rice_Cakes).jpg'},
 'Technology':{url:'https://images.unsplash.com/photo-1632154131780-93817e5beb2e?auto=format&fit=crop&w=1200&q=85',credit:'Han Wen / Unsplash',creditUrl:'https://unsplash.com/photos/a-person-sitting-at-a-desk-with-two-laptops-1ZHvbXBNwaI'},
 'Lifestyle':{url:'https://images.unsplash.com/photo-1753351055246-a7efae066eef?auto=format&fit=crop&w=1200&q=85',credit:'Vitaly Gariev / Unsplash',creditUrl:'https://unsplash.com/photos/friends-are-chatting-and-having-coffee-at-a-cafe-rioA77g2-XU'},
};
export function getExhibits(decade:string, category:Category, period=0):Exhibit[] {
 const era=decades.find(d=>d.id===decade)!;
 const range=yearRanges[decade][period];
 const source=imageSources[category];
 return stories[category].slice(period*2,period*2+2).map((title,i)=>{
  const object=era.objects[categories.indexOf(category)];
  return {title:`${object}: ${title}`,description:`${descriptions[category]} During ${range}, ${object.toLowerCase()} became part of the everyday moments remembered from the ${decade}.`,art:['band','singer','mixtape','karaoke'][(period*2)+i],tag:`${decade} · ${category}`,year:range,image:source.url,imageCredit:source.credit,imageCreditUrl:source.creditUrl};
 });
}
