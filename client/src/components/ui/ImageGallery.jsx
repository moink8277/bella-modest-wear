import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function ImageGallery({ images = [], alt = '' }) {
    const [active, setActive] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    if (images.length === 0) {
        return <div className="aspect-[3/4] rounded-[var(--radius-bmw-lg)] bg-cream" aria-hidden="true" />;
    }

    const goTo = (i) => setActive((i + images.length) % images.length);

    return (
        <div className="flex flex-col gap-3">
            <div className="relative aspect-[3/4] rounded-[var(--radius-bmw-lg)] overflow-hidden bg-cream group">
                <img
                    src={images[active]}
                    alt={`${alt} — image ${active + 1} of ${images.length}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-[var(--ease-luxury)] group-hover:scale-105"
                />

                <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    aria-label="View fullscreen"
                    className="absolute bottom-3 right-3 p-2 rounded-full bg-ivory/90 hover:bg-ivory transition-colors"
                >
                    <Expand className="h-4 w-4 text-espresso" />
                </button>

                {images.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(active - 1)}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-ivory/90 hover:bg-ivory transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 text-espresso" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(active + 1)}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-ivory/90 hover:bg-ivory transition-colors"
                        >
                            <ChevronRight className="h-4 w-4 text-espresso" />
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                    {images.map((img, i) => (
                        <button
                            key={img}
                            type="button"
                            onClick={() => setActive(i)}
                            aria-label={`View image ${i + 1}`}
                            aria-current={i === active}
                            className={cn(
                                'shrink-0 h-16 w-14 rounded-[var(--radius-bmw)] overflow-hidden border-2 transition-colors',
                                i === active ? 'border-gold' : 'border-transparent'
                            )}
                        >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {fullscreen && (
                    <motion.div
                        className="fixed inset-0 z-[95] bg-espresso/95 flex items-center justify-center p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFullscreen(false)}
                    >
                        <button
                            type="button"
                            onClick={() => setFullscreen(false)}
                            aria-label="Close fullscreen view"
                            className="absolute top-5 right-5 p-2 text-ivory"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <img
                            src={images[active]}
                            alt={`${alt} — fullscreen`}
                            className="max-h-full max-w-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}