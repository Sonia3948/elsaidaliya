
import Layout from "@/components/layout/Layout";

const TermsPage = () => {
  return (
    <Layout>
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Conditions d'Utilisation</h1>
          
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="mb-4">
              Bienvenue sur Elsaidaliya. En utilisant notre plateforme, vous acceptez ces conditions d'utilisation. 
              Veuillez les lire attentivement.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptation des Conditions</h2>
            <p className="mb-4">
              En accédant à ou en utilisant Elsaidaliya, vous acceptez d'être lié par ces Conditions. 
              Si vous n'acceptez pas ces Conditions, vous ne devez pas utiliser notre plateforme.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Éligibilité</h2>
            <p className="mb-4">
              Pour utiliser notre plateforme, vous devez être un professionnel du secteur pharmaceutique en Algérie, 
              soit en tant que pharmacien, soit en tant que fournisseur. Vous devez être légalement autorisé à exercer 
              votre profession et posséder toutes les licences et autorisations requises par la loi algérienne.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Inscription et Compte</h2>
            <p className="mb-4">
              Lors de l'inscription, vous devez fournir des informations exactes, complètes et à jour. Vous êtes responsable 
              du maintien de la confidentialité de votre compte et de votre mot de passe, et vous acceptez de ne pas partager 
              ces informations avec des tiers. Vous êtes entièrement responsable de toutes les activités qui se produisent sous votre compte.
            </p>
            <p className="mb-4">
              L'adresse email et le numéro de téléphone utilisés lors de l'inscription doivent être uniques et ne peuvent être 
              associés qu'à un seul compte.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contenu</h2>
            <p className="mb-4">
              Vous êtes responsable de tout contenu que vous publiez sur notre plateforme. Ce contenu ne doit pas être illégal, 
              trompeur, menaçant, diffamatoire, obscène, ou autrement répréhensible. Vous ne devez pas violer les droits de propriété 
              intellectuelle d'autrui.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Propriété Intellectuelle</h2>
            <p className="mb-4">
              Tous les droits de propriété intellectuelle relatifs à notre plateforme et son contenu appartiennent à Elsaidaliya 
              ou à ses concédants de licence. Vous n'obtenez aucun droit de propriété sur notre plateforme ou son contenu.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Limitation de Responsabilité</h2>
            <p className="mb-4">
              Elsaidaliya n'est pas responsable des transactions entre les utilisateurs de la plateforme. Nous agissons uniquement 
              comme intermédiaire pour faciliter les connexions entre pharmaciens et fournisseurs. Toute transaction, contrat ou accord 
              conclu entre utilisateurs est strictement entre ces utilisateurs, et Elsaidaliya n'est pas partie à ces accords.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Résiliation</h2>
            <p className="mb-4">
              Nous pouvons suspendre ou résilier votre accès à notre plateforme à tout moment, pour quelque raison que ce soit, 
              sans préavis ni responsabilité.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Modifications des Conditions</h2>
            <p className="mb-4">
              Nous pouvons modifier ces Conditions à tout moment. Les modifications prennent effet dès leur publication sur notre plateforme. 
              En continuant à utiliser notre plateforme après la publication des modifications, vous acceptez ces modifications.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Loi Applicable</h2>
            <p className="mb-4">
              Ces Conditions sont régies et interprétées conformément aux lois de l'Algérie.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
            <p className="mb-4">
              Si vous avez des questions concernant ces Conditions, vous pouvez nous contacter à :
            </p>
            <p className="mb-4">
              Email : <a href="mailto:contact@elsaidaliya.com" className="text-pharmacy-accent hover:underline">contact@elsaidaliya.com</a>
            </p>
            <p className="mb-12">
              Téléphone : +213 553 720 952
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
