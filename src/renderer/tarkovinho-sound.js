(function(root){
 const profiles={
  pistol:{duration:.16,filter:2800,pitch:150,gain:.15},
  smg:{duration:.10,filter:3800,pitch:185,gain:.11},
  m4:{duration:.21,filter:2400,pitch:115,gain:.17},
  shotgun:{duration:.34,filter:1300,pitch:75,gain:.22},
  sniper:{duration:.48,filter:1900,pitch:60,gain:.23},
  step:{duration:.085,filter:650,pitch:95,gain:.04}
 };
 class TarkovinhoSound{
  constructor(){this.context=null;this.noise=null;this.voices=0}
  play(kind,volume=1,pan=0,surface='yard'){
   const config=profiles[kind];if(!config||this.voices>=16)return;
   try{
    const Audio=root.AudioContext||root.webkitAudioContext;if(!Audio)return;
    const ctx=this.context||(this.context=new Audio());
    if(ctx.state==='suspended')void ctx.resume().catch(()=>{});
    if(!this.noise){this.noise=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*.6),ctx.sampleRate);const values=this.noise.getChannelData(0);for(let i=0;i<values.length;i++)values[i]=Math.random()*2-1}
    const now=ctx.currentTime,source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),body=ctx.createOscillator(),bodyGain=ctx.createGain(),output=ctx.createGain();
    const stereo=ctx.createStereoPanner?ctx.createStereoPanner():null;
    output.gain.value=Math.max(0,Math.min(1,volume));
    if(stereo){stereo.pan.value=Math.max(-1,Math.min(1,pan));output.connect(stereo);stereo.connect(ctx.destination)}else output.connect(ctx.destination);
    source.buffer=this.noise;filter.type='lowpass';filter.frequency.value=config.filter*(kind==='step'&&surface==='warehouse'?2.3:1);
    gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(config.gain,now+.003);gain.gain.exponentialRampToValueAtTime(.001,now+config.duration);
    source.connect(filter);filter.connect(gain);gain.connect(output);
    body.type='sine';body.frequency.setValueAtTime(config.pitch,now);body.frequency.exponentialRampToValueAtTime(35,now+config.duration);
    bodyGain.gain.setValueAtTime(config.gain*.55,now);bodyGain.gain.exponentialRampToValueAtTime(.001,now+config.duration);
    body.connect(bodyGain);bodyGain.connect(output);this.voices++;
    source.onended=()=>{for(const node of [source,filter,gain,body,bodyGain,output,stereo])node?.disconnect();this.voices--};
    source.start(now);body.start(now);source.stop(now+config.duration);body.stop(now+config.duration);
   }catch{}
  }
  mute(){if(this.context?.state==='running')void this.context.suspend().catch(()=>{})}
 }
 TarkovinhoSound.profiles=profiles;
 if(typeof module!=='undefined'&&module.exports)module.exports=TarkovinhoSound;else root.TarkovinhoSound=TarkovinhoSound;
})(typeof globalThis==='undefined'?this:globalThis);
