// Combined intro and content in single box
export default function HomeHero() {
  return (
    <div className="bg-[#f0f1f3] rounded-lg border border-gray-100 shadow-3d p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Bemästra Bilkunskap
      </h1>
      
      <div className="text-base space-y-4">
        <p>
          För dig som vill <strong>lära dig om bilar</strong> och verkligen förstå hur{' '}
          <strong>fordon</strong> fungerar, är detta rätt plats. Vi täcker allt från
          grunderna i bilköp till avancerad bilvård och underhåll. Vårt uppdrag är
          att ge dig beprövade råd och praktisk kunskap för din{' '}
          <strong>bilägare</strong>.
        </p>
        
        <p>
          Men vad innebär det i praktiken? Bilvärlden kan kännas överväldigande. Det är
          en värld av ständigt uppdaterade modeller, tekniska termer och hundratals
          olika aspekter att tänka på. Det är lätt att gå vilse. Bilråd.se är skapad för att vara din
          kompass i denna värld – en central kunskapskälla som bryter ner komplexa ämnen till
          begripliga och handlingskraftiga steg.
        </p>
        
        <h2 className="text-xl font-bold text-gray-800 mt-4 mb-3">
          Hur vi hjälper dig att lyckas
        </h2>
        
        <p>
          För att ge dig en tydlig väg framåt har vi strukturerat vår kunskap kring de tre
          kärnområdena för alla bilägare. Genom att förstå och arbeta med
          dessa kan du systematiskt förbättra din bilkunskap.
        </p>
        
        <ul className="list-disc pl-6 space-y-2 my-3">
          <li>
            <strong>Bilköp:</strong> Allt du behöver veta om att köpa bil. Vi guidar dig
            genom valet av rätt bil, vad du ska tänka på vid besök hos återförsäljaren,
            och hur du får bästa möjliga affär.
          </li>
          <li>
            <strong>Bilvård:</strong> Håll din bil i toppskick. Vi visar dig hur du
            sköter underhåll, tvättar och vårdar din bil för att den ska hålla längre
            och behålla sitt värde.
          </li>
          <li>
            <strong>Bilråd:</strong> Praktiska tips och råd för vardagen. Från
            försäkringar till bensinsparande körteknik – vi hjälper dig att bli en
            smartare bilägare.
          </li>
        </ul>
        
        <h2 className="text-xl font-bold text-gray-800 mt-4 mb-3">
          Alltid uppdaterad – Alltid relevant
        </h2>
        
        <p>
          Bilbranschen förändras kontinuerligt med nya modeller, teknologier och trender.
          Vi bevakar aktivt branschen, analyserar nyheter och ser till att
          våra guider och råd reflekterar vad som fungerar idag och imorgon. Hos
          oss hittar du inga snabba &quot;tricks&quot;, bara hållbara och beprövade råd som bygger
          verkligt värde över tid.
        </p>
        
        <h2 className="text-xl font-bold text-gray-800 mt-4 mb-3">
          Utforska våra senaste artiklar
        </h2>
        
        <p>
          Börja din resa nu. Dyk ner i våra senaste guider och artiklar här nedanför. 👇
        </p>
      </div>
    </div>
  );
}
