window.JADE_PRODUCTS=[["Chocolat Tudo", "0c144fb5c620", "Clássicos", "Massa chiffon de cacau com cobertura de brigadeiro tradicional."], ["Cenourão", "ad35d457aafd", "Clássicos", "Massa de cenoura com cobertura de brigadeiro tradicional."], ["Borboletas ao Vento", "084fb790d45e", "Celebrações", "Uma decoração delicada, com borboletas em azul."], ["Rosas do Encanto", "0d068a901283", "Celebrações", "Rosas em tons de rosa para uma mesa de festa."], ["Flores de Ouro", "6900d8df8b2d", "Celebrações", "Flores delicadas e detalhes em dourado."], ["Corações Doces", "ed31041790af", "Celebrações", "Um bolo decorado com pequenos corações."], ["Diva do Sabor", "16b8dc39c2d3", "Personalizados", "Uma mensagem com personalidade, à sua maneira."], ["Novo Ciclo", "46dbf31ef950", "Personalizados", "Tons de rosa e uma mensagem para celebrar."]];
// APP START







'use strict';
(() => {
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const products = window.JADE_PRODUCTS;
const menu = $('.menu-toggle'), nav = $('#main-nav');
function closeMenu(restore=false) {
 nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Abrir menu');
 if(restore) menu.focus();
}
menu.addEventListener('click',()=>{
 const open = !nav.classList.contains('open');
 nav.classList.toggle('open',open); menu.setAttribute('aria-expanded',String(open)); menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);});
matchMedia('(min-width:761px)').addEventListener('change',()=>closeMenu());
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 let count=0;
 $$('.catalog-section .product-card').forEach(card=>{
  const visible=button.dataset.filter==='Todos'||card.dataset.category===button.dataset.filter;
  card.hidden=!visible;if(visible)count++;
 });
 $('#result-count').textContent=count+' '+(count===1?'inspiração':'inspirações');
}));
const productDialog=$('#product-dialog');
let selectedProduct=0;
$$('[data-product]').forEach(button=>button.addEventListener('click',()=>{
 selectedProduct=Number(button.dataset.product);
 const p=products[selectedProduct];
 $('#product-title').textContent=p[0];
 $('#product-description').textContent=p[3];
 $('#product-photo').src='img/img_'+p[1]+'.jpg';
 $('#product-photo').alt=p[0]+' — fotografia de referência do catálogo';
 productDialog.showModal();
}));
$('.close-product').addEventListener('click',()=>productDialog.close());
$('.choose-product').addEventListener('click',()=>{
 productDialog.close();
 const custom=$('#custom-form');
 if(custom){
  $('#cake-model').value=products[selectedProduct][0];
  $('#personalizar').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  $('#cake-model').focus({preventScroll:true});
 }else location.href='catalogo.html?modelo='+selectedProduct+'#personalizar';
});
const custom=$('#custom-form');
if(custom){
 const idx=new URLSearchParams(location.search).get('modelo');
 if(idx!==null&&/^\d+$/.test(idx)&&products[Number(idx)])$('#cake-model').value=products[Number(idx)][0];
 custom.addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(custom);
  $('#custom-summary').textContent='A sua ideia · demonstração\n'+data.get('modelo')+'\nTamanho: '+data.get('tamanho')+'\nMassa: '+data.get('massa')+'\nRecheio: '+data.get('recheio')+'\nDecoração: '+data.get('estilo')+'\n\nNenhuma encomenda foi criada ou enviada. Combinação ilustrativa, sujeita a confirmação pela Jade.';
 });
}
const review=$('#review-form');
if(review)review.addEventListener('submit',e=>{
 e.preventDefault();
 const rating=new FormData(review).get('rating');
 $('#review-preview').textContent='PRÉ-VISUALIZAÇÃO FICTÍCIA · '+rating+'/5\n'+$('#review-text').value.trim()+'\n\nNada foi publicado, enviado ou guardado.';
});
const chat=$('#chat-dialog'), launcher=$('.chat-launch');
launcher.addEventListener('click',()=>{
 closeMenu();
 chat.showModal();launcher.setAttribute('aria-expanded','true');
});
// Enable the launcher only after its local interaction is ready.
launcher.hidden=false;
$('.close-chat').addEventListener('click',()=>chat.close());
chat.addEventListener('close',()=>{launcher.setAttribute('aria-expanded','false');launcher.focus({preventScroll:true});});
[chat,productDialog].forEach(d=>d.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const focusable=[...d.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length);
 const first=focusable[0],last=focusable[focusable.length-1];
 if(!first){e.preventDefault();return;}
 if(e.shiftKey&&(document.activeElement===first||!d.contains(document.activeElement))){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&(document.activeElement===last||!d.contains(document.activeElement))){e.preventDefault();first.focus();}
}));
[chat,productDialog].forEach(d=>d.addEventListener('click',e=>{
 const r=d.getBoundingClientRect();
 if(e.target===d&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))d.close();
}));
function reply(q){
 const t=q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 if(/alerg|gluten|lactose|vegan|ingrediente|intoler|diabet|saude|gravida/.test(t))return 'Não tenho fichas de ingredientes ou alergénios verificadas. Confirme ingredientes, alergénios e possível contaminação cruzada diretamente com a Jade antes de consumir. Não posso garantir adequação alimentar.';
 if(/pag|preco|custo|mb way|iban|cartao/.test(t))return 'Este protótipo não apresenta preços confirmados nem recebe pagamentos. Não existe checkout ou ligação a serviços de pagamento. O orçamento e as condições precisam de validação pela Jade.';
 if(/entreg|prazo|amanha|hoje|reserva|disponib/.test(t))return 'O site original refere entregas em Almada e arredores e antecedência de 2–3 dias. São informações provisórias: esta demo não confirma datas, zonas, custos, reservas ou disponibilidade.';
 if(/onde|local|morada|caparica|almada/.test(t))return 'O site existente indica Caparica, Almada: Rua da Bela Vista 92, 2805-004 Caparica. A morada aguarda reconfirmação. Não se pressupõe loja aberta ao público; combine qualquer visita com a Jade fora desta demo.';
 if(/sabor|massa|recheio|chocolate|cenoura/.test(t))return 'No catálogo existente há Chocolat Tudo, com massa de cacau e brigadeiro, e Cenourão, de cenoura com brigadeiro. A demo também explora outras massas e recheios. Ingredientes, combinações e disponibilidade precisam de confirmação.';
 if(/personal|encomend|bolo|pedido/.test(t))return 'Abra “Os nossos bolos”, explore um modelo e escolha “Personalizar na demo”. Pode experimentar massa, recheio e decoração. O resumo fica apenas no ecrã: nada é enviado e nenhuma encomenda é criada.';
 if(/horario|aberto|hora/.test(t))return 'O site anterior indica atendimento diário das 8h00 às 20h00. Este horário é provisório e precisa de confirmação pela Jade; não confirma uma loja aberta ao público.';
 if(/contact|jade|humano|pessoa|whatsapp|email|mensagem/.test(t))return 'Os contactos do site original estão apresentados, sem ligações ativas, em “Onde estamos”. Não consigo contactar a Jade, transferir esta conversa ou enviar mensagens. Não partilhe dados pessoais aqui.';
 if(/ola|bom dia|boa tarde|obrigad/.test(t))return 'Olá! Esta é uma ajuda de demonstração, com respostas pré-definidas. Posso explicar o catálogo, a personalização e a localização.';
 return 'Não tenho uma resposta verificada para essa pergunta. Experimente as sugestões ou consulte “Onde estamos”. Sou uma demo sem IA real: não confirmo informações nem envio mensagens à Jade.';
}
function ask(q){
 q=String(q).trim().slice(0,240);if(!q)return;
 const messages=$('#chat-messages');
 for(const [cls,text] of [['user',q],['bot',reply(q)]]){
  const p=document.createElement('p');p.className=cls;p.textContent=text;messages.appendChild(p);
 }
 // Bound memory and keep all text inert, including user input.
 while(messages.children.length>21)messages.firstElementChild.remove();
 messages.scrollTop=messages.scrollHeight;
 $('#chat-input').value='';
}
$('#chat-form').addEventListener('submit',e=>{e.preventDefault();ask($('#chat-input').value);});
$$('[data-question]').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.question)));
// Never allow form fallback navigation in this review prototype.
$$('form').forEach(f=>f.addEventListener('submit',e=>e.preventDefault()));
})();

// Progressive enhancement only: CSS and the underlying DOM always stay visible.
// If observation or animation fails, there is no pending/hidden state to clear.
(() => {
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 if(preference.matches || typeof IntersectionObserver!=='function' || !Element.prototype.animate)return;
 const running=new Set();
 let observer;
 const stop=()=>{if(observer)observer.disconnect();for(const animation of running)animation.cancel();running.clear();};
 try{
  observer=new IntersectionObserver(entries=>{
   for(const entry of entries){
    if(!entry.isIntersecting)continue;
    const section=entry.target;observer.unobserve(section);
    if(preference.matches)continue;
    section.dataset.reveal='complete';
    // No entry animation for initial viewport content, forms, links or buttons.
    const nodes=section.matches('.product-card') ? section.querySelectorAll('.product-image img, .product-meta, :scope > p') : section.querySelectorAll(':scope > .eyebrow, :scope > h2, :scope > p, :scope > img');
    [...nodes].forEach((node,index)=>{
     try{
      const animation=node.animate([{opacity:.4,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:750,delay:Math.min(index,2)*90,easing:'cubic-bezier(.2,.65,.3,1)',fill:'none'});
      running.add(animation);
      animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
     }catch{ /* The original visible element needs no recovery. */ }
    });
   }
  },{threshold:.08,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.product-card,.section-heading > div,.story-copy,.logo-panel,.steps > div,.steps li > div,.custom-section > div,.review-editorial,.location-info,.location-note,.faq > div:first-child').forEach(section=>{
   if(section.getBoundingClientRect().top>=innerHeight)observer.observe(section);
  });
  preference.addEventListener('change',()=>{if(preference.matches)stop();});
  document.addEventListener('focusin',()=>{for(const animation of running)animation.cancel();running.clear();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const animation of running)animation.cancel();running.clear();}});
 }catch{stop();}
})();
