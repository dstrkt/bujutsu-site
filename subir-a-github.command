#!/bin/bash
# ============================================================
#  Subir el sitio Bujutsu a GitHub (Mac)
#  Doble clic (o: click derecho > Abrir la primera vez).
#  Requiere Git. Si tienes GitHub CLI (gh), crea el repo solo.
# ============================================================
cd "$(dirname "$0")"
echo "=== Inicializando repositorio Git ==="
git init
git add .
git commit -m "Sitio Bujutsu - primera version"
git branch -M main

if command -v gh >/dev/null 2>&1; then
  echo "=== GitHub CLI detectado: creando repo y subiendo ==="
  gh repo create dstrkt/bujutsu-site --public --source=. --push
else
  echo ""
  echo ">> Primero crea el repo vacio en https://github.com/new"
  echo ">> Nombre: bujutsu-site  (Public). Cuando este creado, presiona ENTER."
  read _
  git remote add origin https://github.com/dstrkt/bujutsu-site.git
  git push -u origin main
fi
echo ""
echo "=== Listo: https://github.com/dstrkt/bujutsu-site ==="
echo "(puedes cerrar esta ventana)"
