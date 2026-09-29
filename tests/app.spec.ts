import { test, expect } from '@playwright/test';
test('all pages render without runtime errors, desktop and mobile',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of [1440,390]){await page.setViewportSize({width,height:960});for(const path of ['/','/about','/galleries','/galleries/2000s','/galleries/1990s','/galleries/2010s','/galleries/2020s']){await page.goto(path);await expect(page.locator('h1')).toBeVisible();await page.evaluate(()=>document.fonts.ready);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);if(['/', '/about','/galleries','/galleries/2000s'].includes(path))await page.screenshot({path:`test-results/${width}-${path.replaceAll('/','')||'home'}.png`,fullPage:true});}}
 expect(errors).toEqual([]);
});
test('category controls, stories, decade navigation and mobile menu',async({page})=>{
 await page.goto('/galleries/2000s');for(const name of ['TV & Film','Fashion','Games & Sports','Food','Technology','Lifestyle','Music']){await page.getByRole('button',{name,exact:true}).click();await expect(page.locator('.exhibit-panel h2')).toHaveText(name);await expect(page.locator('.exhibit-card')).toHaveCount(4);}
 await page.getByRole('button',{name:'OPM Bands'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await page.locator('.decade-switch').getByRole('link',{name:'2010s'}).click();await expect(page.locator('h1')).toHaveText('2010s');
 await page.setViewportSize({width:390,height:844});await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation').getByRole('link',{name:'About'}).click();await expect(page.locator('h1')).toHaveText('Digital Mirror');await expect(page.getByRole('button',{name:'Open navigation'})).toBeVisible();
});
test('audio plays, seeks, changes track, persists during navigation and pauses',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Play',exact:true}).click();await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();await expect.poll(()=>page.locator('audio').evaluate((el:HTMLAudioElement)=>el.currentTime)).toBeGreaterThan(0);
 await page.getByRole('slider',{name:'Seek playback'}).fill('12');expect(await page.locator('audio').evaluate((el:HTMLAudioElement)=>el.currentTime)).toBeGreaterThanOrEqual(12);
 await page.getByRole('link',{name:'Enter the time portal'}).click();await expect(page.getByRole('button',{name:'Pause',exact:true})).toBeVisible();await page.getByRole('button',{name:'Next track'}).click();await expect(page.locator('.track-info strong')).toHaveText('Postcards from Manila');await expect.poll(()=>page.locator('audio').evaluate((el:HTMLAudioElement)=>el.paused)).toBe(false);
 await page.getByRole('button',{name:'Mute',exact:true}).click();expect(await page.locator('audio').evaluate((el:HTMLAudioElement)=>el.volume)).toBe(0);await page.getByRole('button',{name:'Pause',exact:true}).click();expect(await page.locator('audio').evaluate((el:HTMLAudioElement)=>el.paused)).toBe(true);
});
