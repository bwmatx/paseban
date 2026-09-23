TASK: Fix Nezuko Custom Cursor — Default Arrow Cursor Still Not Matching

The custom cursor implementation is partially working:

- Hover/interactable cursor already changes correctly to the Nezuko pointer.
- BUT the normal/default mouse cursor (arrow) is still the browser's native cursor.
- The default cursor must also use the Nezuko cursor asset shown on the Custom Cursor page.

Reference:
https://custom-cursor.com/en/collection/demon-slayer-kimetsu-no-yaiba/dskny-nezuko-kamado

CURRENT STATUS:
- Interactive/hover cursor: WORKING
- Default/normal cursor: NOT WORKING
- Do NOT rebuild the whole cursor system.
- Fix only the default cursor implementation.

REQUIREMENTS:

1. Inspect the current custom cursor implementation first.
   Do not assume the existing structure.

2. Verify which asset is currently being used for:
   - default cursor
   - interactive pointer/hover cursor

3. The normal desktop cursor must use the Nezuko cursor asset from the referenced Custom Cursor pack.

4. The interactive cursor must continue using the existing working Nezuko pointer asset.

5. Use native CSS cursor behavior where possible:
   
   cursor: url(...), auto;

   Do NOT replace the implementation with a mousemove JavaScript cursor unless absolutely necessary.

6. IMPORTANT:
   The Custom Cursor page provides separate:
   - cursor asset
   - pointer asset

   Make sure these are NOT accidentally reversed.

7. If the current implementation references the CDN directly, verify whether the browser can actually load the asset.

   Known reference assets from the Custom Cursor page were:

   Default cursor:
   https://cdn.custom-cursor.com/packs/2162/pack2787.png

   Pointer:
   https://cdn.custom-cursor.com/db/4907/32/arrow2787.png

   However, these CDN assets previously returned HTTP 403 when fetched externally.

   DO NOT bypass CDN restrictions or implement a workaround intended to circumvent access controls.

8. If the default cursor asset cannot be loaded from the CDN:
   - inspect whether the project already contains a local copy;
   - if a local copy exists, use that;
   - otherwise determine whether the asset can legally/technically be bundled locally;
   - do not invent or substitute another Nezuko image;
   - do not download from an unrelated third-party source just to make it work.

9. If a local asset is available, place/use it under something like:

   /assets/cursors/

   and use it with:

   cursor: url('/assets/cursors/<asset>.png') <x> <y>, auto;

   Use the correct hotspot coordinates based on the actual image dimensions.

10. Apply the default cursor globally ONLY on desktop/fine-pointer devices:

   @media (hover: hover) and (pointer: fine) {
       ...
   }

11. Mobile and touch devices must remain completely unaffected.

12. Preserve the current working hover/interactable cursor.

13. Check cursor behavior for at least:
   - body/background
   - normal text
   - images
   - links
   - buttons
   - inputs
   - cards
   - navigation
   - dropdown items

14. Make sure a more specific CSS rule is not accidentally overriding the default cursor.

15. Check for:
   - cursor: default
   - cursor: auto
   - cursor: pointer
   - cursor: none
   - inline cursor styles
   - component-specific cursor declarations

   that may override the global Nezuko cursor.

16. DO NOT:
   - add cursor trails
   - add cursor particles
   - add mouse-follow animations
   - add GSAP
   - add another dependency
   - change the website design
   - change colors
   - change typography
   - change layout
   - modify unrelated components

17. Keep the existing hover behavior exactly as it is unless a small selector adjustment is required to make the default/hover relationship correct.

18. After making the fix, verify that:

   Desktop:
   Normal area → Nezuko default cursor
   Link/button → Nezuko pointer cursor

   Mobile/touch:
   Native browser behavior remains unchanged.

19. If the exact default asset cannot be used because of the source/CDN restriction or licensing limitation, DO NOT fake a successful implementation.

   Report clearly:
   - what asset was found
   - where it came from
   - why it could/could not be loaded
   - what is currently being used
   - what remains unresolved

20. Final response must include:
   - files modified
   - exact cause of the default cursor not appearing
   - exact fix applied
   - confirmation that hover cursor still works
   - confirmation that mobile/touch remains unaffected
   - any asset/licensing/CDN limitation encountered

SCOPE:
ONLY fix the default Nezuko cursor.
Do not refactor or redesign the existing cursor system.
Do not modify unrelated website functionality.