'use client';

import { useEffect, useRef } from 'react';

export default function Partitura() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;

        // Limpiar contenedor
        containerRef.current.innerHTML = '';

        // Import dinámico para VexFlow 5
        import('vexflow').then((VF) => {
            const {
                Renderer,
                Stave,
                StaveNote,
                Formatter
            } = VF;

            // Crear renderer SVG
            const renderer = new Renderer(
                containerRef.current!,
                Renderer.Backends.SVG
            );

            // Ajustar el tamaño del renderer
            renderer.resize(500, 400);
            const context = renderer.getContext();

            // Pentagrama superior (clave de sol)
            const staveTreble = new Stave(10, 40, 250);
            staveTreble.addClef('treble');
            staveTreble.addKeySignature('C');
            staveTreble.addTimeSignature('4/4');
            staveTreble.setContext(context).draw();


            // Notas y duraciones
            // w o 1 = Redonda
            // h o 2 = Blanca
            // q o 4 = Negra
            // 8 = Corchea
            // 16 = Semicorchea

            // types
            type VexFlowDuration = 'q' | '8' | '16' | 'hr' | 'w' | '4' | '2' | '1';
            type ClefType = 'treble' | 'bass' | 'alto' | 'tenor';

            type NoteData = {
                keys: string[];
                duration: VexFlowDuration;
                clef?: ClefType;
                stemDirection?: number; // -1 para abajo, 1 para arriba
            };

            // Notas para clave de sol 

            const trebleNoteData: NoteData[] = [
                { keys: ['c/4'], duration: 'q' },
                { keys: ['e/4'], duration: 'q' },
                { keys: ['g/4'], duration: 'q' },
                { keys: ['b/4'], duration: 'q' }
            ];

            const trebleNotes = trebleNoteData.map(({ keys, duration }) =>
                new StaveNote({
                    keys: keys,
                    duration: duration
                })
            );



            // Pentagrama inferior (clave de fa)
            const staveBass = new Stave(10, 140, 250);
            staveBass.addClef('bass');
            staveBass.addKeySignature('C');
            staveBass.addTimeSignature('4/4');
            staveBass.setContext(context).draw();


            const bassNoteData: NoteData[] = [
                { keys: ['c/3', 'e/3'], duration: 'q' },
                { keys: ['f/3'], duration: 'q' },
                { keys: ['g/3'], duration: 'q' },
                { keys: ['b/3'], duration: 'q' }
            ];

            // clef = 'bass' por defecto para no repetirlo en cada nota, 
            // este clef bass permite que las notas se dibujen en la parte inferior de manera correcta
            const bassNotes = bassNoteData.map(({ keys, duration, clef = 'bass' }) =>
                new StaveNote({
                    keys: keys,
                    duration: duration,
                    clef: clef
                })
            );

            // Formatear y dibujar notas
            Formatter.FormatAndDraw(context, staveTreble, trebleNotes);
            Formatter.FormatAndDraw(context, staveBass, bassNotes);

        }).catch(error => {
            console.error('Error cargando VexFlow:', error);
        });

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, []);

    return (
        <div className="p-4 border rounded-lg bg-white text-black">
            <h2 className="text-xl font-bold mb-4">Partitura de Piano</h2>
            <div ref={containerRef} className="vexflow-container" />
        </div>
    );
}