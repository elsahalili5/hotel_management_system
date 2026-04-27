import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/HeroSection'
import {TextSection} from '#/components/TextSection'
import {SplitSection} from '#/components/SplitSection'

export const Route = createFileRoute('/(app)/spa')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section>
      <HeroSection 
          image ="https://confident-health-b88439dafa.media.strapiapp.com/medium_SPA_2_9410954b4d.jpg"
          title = "SPA & SPORTS"
          height="500px"
      />
      <TextSection
      subtitle="SPA & Sports Center"
      paragraphs={['Mansio Sports Center offers a modern 6000-square-meter space where guests can enjoy a full wellness experience, including an indoor swimming pool, fitness center, Finnish sauna, bio sauna, Turkish bath, beauty salon, and relaxing massages. During the summer season, guests can also unwind at two outdoor swimming pools with a full-service bar and restaurant, as well as a tennis court. All Mansio hotel guests are entitled to free access to these exclusive SPA and sports facilities.']}
       />
       <SplitSection 
       title="Mansio Swimming pools"
       text="At Mansio, our swimming pools offer the perfect place to relax, exercise, and refresh your body and mind. Guests can enjoy leisurely swims, energizing laps, or simply unwind by the poolside in a serene and beautifully designed environment. Whether indoors or outdoors, the Mansio pools provide a refreshing escape for relaxation, fun, and wellness."
       image="https://confident-health-b88439dafa.media.strapiapp.com/medium_SPA_3_2ce15bce40.jpg"
       />
       <SplitSection 
          title="Mansio Gym"
          text="At Mansio, your health and wellness come first with our 24-hour fully equipped gym, designed to keep your fitness routine on track during your stay. The facility features a dedicated area for yoga or personal training, offering tailored workouts to suit your needs. With warm wood accents and a serene atmosphere, the space provides the perfect setting for yoga, meditation, and mindful movement—blending fitness with tranquility and natural elegance."
          image="https://www.epidamn.com/assets/images/fitness.jpg"
          imageRight={false}
       />
       <SplitSection 
       title="Mansio Sports"
       text="At Mansio, staying active and enjoying your favorite sports is effortless. Guests can play tennis on our well-maintained courts, join invigorating yoga sessions in serene, naturally lit spaces, or take part in a variety of fitness and wellness activities designed to energize both body and mind. From morning stretches to friendly matches and guided training, Mansio offers the perfect balance of sport, relaxation, and revitalization for every guest."
       image="https://confident-health-b88439dafa.media.strapiapp.com/tennis_a3c1017649.jpg"
       />
       <SplitSection
       title="Mansio Massage"
       text="At Mansio, indulge in ultimate relaxation with our luxurious massage treatments. Expert therapists offer a variety of massages designed to relieve stress, soothe tired muscles, and rejuvenate your body and mind. Whether you choose a gentle relaxation massage, a deep tissue session, or a specialized wellness treatment, Mansio’s serene spa environment ensures a peaceful and revitalizing experience."
       image="https://www.epidamn.com/assets/images/appointmentone.jpg"
       imageRight={false}
       />
 </section>
  )
}
