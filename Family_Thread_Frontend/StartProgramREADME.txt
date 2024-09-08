React Related Things:
    Run the React App for quick testing:
    (This is the one you should use the most for your testing)
        npm run dev
        http://localhost:5173/Home

Docker Related Things:
    Build the DockerFile [You only have to do this once]
        docker build -t 380sp24-teamb-frontend .
    Run the docker container [You have to run this every time you want to preview it]
        docker run -d --rm -p 5173:5173 --name FamilyThreadContainer 380sp24-teamb-frontend
    Stop the container
        docker container stop [name]

