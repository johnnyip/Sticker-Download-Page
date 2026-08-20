pipeline {
  agent any
  options { skipDefaultCheckout(true); disableConcurrentBuilds(); timestamps(); timeout(time: 20, unit: 'MINUTES'); buildDiscarder(logRotator(numToKeepStr: '30')) }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Install') { steps { sh 'npm ci' } }
    stage('Build') { steps { sh 'npm run build' } }
    stage('Deploy') { steps { sh '''set -eu
      app_dir=/reactPress/sticker
      build_dir="$app_dir/build"
      mkdir -p "$build_dir"
      find "$build_dir" -mindepth 1 -exec rm -rf {} +
      cp -R ./build/. "$build_dir/"
      find "$build_dir" -maxdepth 3 -type f | sort
    ''' } }
  }
  post { failure { mail to: 'johnny@johnnyip.com', subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}", body: "Sticker Download Page Pipeline failed.\n\nJob: ${env.JOB_NAME}\nBuild: #${env.BUILD_NUMBER}\nBranch: ${env.GIT_BRANCH ?: 'main'}\nCommit: ${env.GIT_COMMIT ?: 'unknown'}\nConsole: ${env.BUILD_URL}console\n" }; always { cleanWs deleteDirs: true, disableDeferredWipeout: true, notFailBuild: true } }
}
