import Layout from "@/components/layout/Layout";
const AboutPage = () => {
  return <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">À propos d'Elsaidaliya</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Facilitant l'approvisionnement pharmaceutique à travers une plateforme innovante et sécurisée.
            </p>
          </div>
          
          <div className="prose prose-lg max-w-3xl mx-auto text-gray-600">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notre mission</h2>
            <p>Elsaidaliya a été développée pour optimiser les processus d’approvisionnement pharmaceutique. Notre plateforme établit un lien direct, structuré et fiable entre pharmaciens et fournisseurs."</p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Comment nous aidons</h2>
            <div className="space-y-4">
              <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-medical-dark mb-2 text-pharmacy-dark">Pour les pharmaciens</h3>
                <p>Nous offrons aux pharmaciens un accès rapide aux catalogues produits des fournisseurs, facilitant une recherche efficace des médicaments nécessaires. Notre plateforme permet également de découvrir de nouvelles offres et de trouver facilement des fournisseurs à proximité de votre pharmacie.</p>
              </div>
              <div className="p-6 border border-gray-100 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-medical-dark mb-2 text-pharmacy-dark">Pour les fournisseurs</h3>
                <p>Nous offrons aux fournisseurs une vitrine numérique pour présenter leurs catalogues de produits et leurs offres spéciales. Notre plateforme leur permet d'atteindre un réseau plus large de pharmacies et de faciliter la distribution de leurs produits.</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notre engagement</h2>
            <p className="mx-0">Elsaidaliya s'engage à fournir une plateforme sécurisée, fiable et facile à utiliser. Nous valorisons:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La transparence dans toutes les interactions entre utilisateurs</li>
              <li>La sécurité des données et des informations commerciales</li>
              <li>L'amélioration continue de notre plateforme basée sur les retours des utilisateurs</li>
              <li>Le support et l'accompagnement de nos utilisateurs</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contactez-nous</h2>
            <p>
              Si vous avez des questions ou des suggestions, n'hésitez pas à nous contacter via notre 
              <a href="/contact" className="text-medical hover:text-medical-dark"> page de contact</a>.
              Notre équipe est là pour vous aider et répondre à toutes vos questions.
            </p>
          </div>
        </div>
      </div>
    </Layout>;
};
export default AboutPage;