pipeline {
  agent any
  options { skipDefaultCheckout(true); disableConcurrentBuilds(); timestamps(); timeout(time: 20, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  environment { HOST_JENKINS_HOME = '/volume2/docker/jenkins'; DEPLOY_DIR = '/volume2/docker/wordpress-johnnyip/wp-content/reactpress/apps/sticker' }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build and Deploy') { steps { sh '''set -eu
      host_source=$(printf '%s' "$PWD" | sed "s#^/var/jenkins_home#$HOST_JENKINS_HOME#")
      docker run --rm -v "$host_source:/source:ro" -v "$DEPLOY_DIR:/deploy" -w /workspace node:20-alpine sh -lc '
        cp -a /source/. /workspace
        npm ci
        npm run build
        mkdir -p /deploy/build
        find /deploy/build -mindepth 1 -exec rm -rf {} +
        cp -R ./build/. /deploy/build/
        find /deploy/build -maxdepth 3 -type f | sort
      '
    ''' } }
  }
  post { failure { mail to: 'johnny@johnnyip.com', subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}", body: "Sticker Download Page Pipeline failed.\n\nJob: ${env.JOB_NAME}\nBuild: #${env.BUILD_NUMBER}\nBranch: ${env.GIT_BRANCH ?: 'main'}\nCommit: ${env.GIT_COMMIT ?: 'unknown'}\nConsole: ${env.BUILD_URL}console\n" }; always { cleanWs deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true } }
}
