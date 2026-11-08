# thatvibecoder

The website for That Vibe Coder: a 3D voxel Buddy on the home page whose head follows your cursor, plus projects (coming soon), guides and the comment-keyword guide pages.

Built with Next.js (App Router, TypeScript), three.js and @react-three/fiber.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Structure

```
public/
  buddy/                 Buddy sprites (stand, wave_1-4) and the avatar
src/
  app/
    layout.tsx           fonts, metadata, global styles
    globals.css          colour tokens and shared list styles
    page.tsx             home: the Buddy hero
    projects/page.tsx
    guides/page.tsx      list of all guides
    [guide]/page.tsx     /bug, /agent, /buddy, /mcp (from content/guides.ts)
  components/
    buddy/VoxelBuddy.tsx 3D Buddy (three.js, client only)
    hero/Hero.tsx        floating nav, name and socials around Buddy
    layout/PageShell.tsx frame for inner pages
    layout/SocialLinks.tsx
  content/               site text: socials, nav, projects, guides
  lib/voxels.ts          turns the pixel sprite into cubes
```

## Editing content

Text lives in `src/content/`. Add a project to `projects.ts`, or a new comment-keyword guide to `guides.ts` (it appears at `/<slug>` and on `/guides` automatically).
