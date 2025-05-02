
import Layout from "@/components/layout/Layout";

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Politique de Confidentialité</h1>
          
          <div className="prose prose-lg text-gray-700 max-w-none">
            <p className="mb-4">
              Elsaidaliya s'engage à protéger votre vie privée. Cette politique de confidentialité décrit comment nous collectons, 
              utilisons et partageons vos informations personnelles lorsque vous utilisez notre plateforme.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Informations que nous collectons</h2>
            <p className="mb-4">
              Nous collectons les informations suivantes lorsque vous vous inscrivez sur notre plateforme :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Nom de votre entreprise</li>
              <li>Adresse email (à usage unique)</li>
              <li>Numéro de téléphone (à usage unique)</li>
              <li>Wilaya</li>
              <li>Image du registre de commerce</li>
              <li>Rôle (pharmacien ou fournisseur)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Comment nous utilisons vos informations</h2>
            <p className="mb-4">
              Nous utilisons les informations collectées pour :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Créer et gérer votre compte</li>
              <li>Fournir et améliorer nos services</li>
              <li>Communiquer avec vous concernant votre compte ou nos services</li>
              <li>Vous permettre de contacter d'autres utilisateurs de la plateforme</li>
              <li>Prévenir la fraude et assurer la sécurité de notre plateforme</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Partage de vos informations</h2>
            <p className="mb-4">
              Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager certaines informations avec :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>D'autres utilisateurs de la plateforme (uniquement les informations nécessaires pour faciliter les connexions entre pharmaciens et fournisseurs)</li>
              <li>Nos prestataires de services qui nous aident à exploiter notre plateforme</li>
              <li>Les autorités compétentes lorsque la loi l'exige</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Sécurité des données</h2>
            <p className="mb-4">
              Nous prenons des mesures techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, 
              modification, divulgation ou destruction. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique 
              n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Vos droits</h2>
            <p className="mb-4">
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Accéder aux données personnelles que nous détenons sur vous</li>
              <li>Rectifier ces données si elles sont inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer au traitement de vos données</li>
              <li>Demander la limitation du traitement de vos données</li>
              <li>Demander la portabilité de vos données</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Modifications de notre politique de confidentialité</h2>
            <p className="mb-4">
              Nous pouvons modifier cette politique de confidentialité de temps à autre. Toute modification sera publiée sur cette page, 
              et nous vous en informerons par email si les modifications sont importantes.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Contact</h2>
            <p className="mb-4">
              Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à :
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

export default PrivacyPolicyPage;
