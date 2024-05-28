import re
import os

def extract_comments_from_file(file_path):
    print("Chemin du fichier :", file_path)
    with open(file_path, 'r') as file:
        file_content = file.read()
        # Utilisation de regex pour extraire les commentaires
        comments = re.findall(r'#(.*)', file_content)
        print(f"Comments found in {file_path}: {comments}")
        return comments

def extract_comments_from_directory(directory):
    all_comments = []
    
    # Afficher le contenu du répertoire
    print("Contenu du répertoire :", os.listdir(directory))
    
    for root, _, filenames in os.walk(directory):
        for filename in filenames:
            if filename.endswith('.py'):
                file_path = os.path.join(root, filename)
                comments = extract_comments_from_file(file_path)
                all_comments.extend(comments)
    return all_comments

def write_comments_to_md(comments, output_file):
    print(f"Writing comments to Markdown file: {output_file}")
    with open(output_file, 'w') as md_file:
        for comment in comments:
            md_file.write(f"- {comment.strip()}\n")
    print("Comments successfully written to Markdown file!")

if __name__ == "__main__":
    # Répertoire contenant les sous-dossiers backend et base
    olympique_app_directory = r"C:\Users\renep\OneDrive\Documents\Olympique_app\Olympique_app\base"


    # Fichier de sortie Markdown
    output_md_file = "commentaires.md"

    # Extraire les commentaires des fichiers Python dans les sous-dossiers backend et base
    comments = extract_comments_from_directory(olympique_app_directory)

    # Écrire les commentaires dans un fichier Markdown
    write_comments_to_md(comments, output_md_file)

    print("Les commentaires ont été extraits et écrits dans le fichier Markdown avec succès !")
