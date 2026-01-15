import { Star, Quote } from "lucide-react";

export default function SocialProofSection() {
    const testimonials = [
        {
            quote: "We finally stopped arguing about the dishes and realized we were actually arguing about feeling seen. This test showed us the pattern we couldn't see.",
            author: "Sarah & Mike",
            context: "Together 7 years",
            rating: 5
        },
        {
            quote: "I thought my partner was just being difficult. Turns out, I was triggering their nervous system without realizing it. Game changer.",
            author: "Alex",
            context: "32, In a relationship",
            rating: 5
        },
        {
            quote: "The 'Red Flags' section validated everything I was feeling, then gave me the tools to actually fix it. Worth every penny.",
            author: "Jessica",
            context: "In Crisis → Together",
            rating: 5
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-background to-secondary/10">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Join 500+ Couples Who Found Their Pattern
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={20} fill="currentColor" />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">4.9 average rating</span>
                    </div>
                </div>

                {/* Testimonials Grid */}
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="relative bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-md transition-shadow"
                        >
                            {/* Quote Icon */}
                            <Quote className="absolute top-6 right-6 text-primary/10" size={48} />

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" className="text-yellow-500" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-foreground/90 leading-relaxed mb-6 relative z-10">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="border-t border-border pt-4">
                                <p className="font-semibold text-foreground">{testimonial.author}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.context}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>500+ couples this month</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>30-day data deletion</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>No sign-up required</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
