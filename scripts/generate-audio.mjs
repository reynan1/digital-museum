import { mkdirSync, writeFileSync } from 'node:fs';
// Original, procedurally composed instrumental loops. No third-party samples.
mkdirSync('public/audio',{recursive:true});
const rate=22050, seconds=32;
for(const [index,name] of ['golden-hour','postcards','neon'].entries()){
 const buffer=Buffer.alloc(44+rate*seconds*2);buffer.write('RIFF');buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(rate*seconds*2,40);
 const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];
 for(let i=0;i<rate*seconds;i++){const t=i/rate,beat=t%0.5,note=notes[(Math.floor(t*2)+index*2)%notes.length]*[1,.75,1.25][index],envelope=Math.exp(-beat*7)*Math.min(1,beat*100);const melody=(Math.sin(2*Math.PI*note*t)+.25*Math.sin(4*Math.PI*note*t))*.16*envelope;const bass=Math.sin(2*Math.PI*notes[Math.floor(t/4)%4]/2*t)*.065;const shimmer=Math.sin(2*Math.PI*note*2*t)*.015*Math.exp(-beat*12);const fade=Math.min(t,1,seconds-t);buffer.writeInt16LE(Math.round((melody+bass+shimmer)*fade*32767),44+i*2)}
 writeFileSync(`public/audio/${name}.wav`,buffer);
}
