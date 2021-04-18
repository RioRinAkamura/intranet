pipeline  {
  agent any
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '1', numToKeepStr: '1')
  }

  stages {
    stage('build') {
      when {
        branch 'develop'
      }

      agent {
        docker {
          image 'node:14-alpine'
        }
      }

      environment {
        REACT_APP_API_URL = "https://api.boilerplate.dev.hdwebsoft.co/v1"
        CI_PROJECT_ID = "25975384"
        CI_JOB_TOKEN = "ZiveEc1yo29oMESFoiN3"
      }
      steps {
        echo 'starting build'
        sh "echo '@hdwebsoft:registry https://gitlab.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/'> .npmrc"
        sh "echo '//gitlab.example.com/api/v4/projects/${CI_PROJECT_ID}/packages/npm/:_authToken=${CI_JOB_TOKEN}' > .npmrc"
        sh 'npm install'
        sh 'npm run build'
        sh 'tar cvzf build.tar.gz dist'
        stash includes: 'build.tar.gz', name: 'build.tar.gz'
      }
    }

    stage('Deploy') {
      when {
        branch 'develop'
      }
      steps {
        echo 'Start deploy...'
        unstash 'build.tar.gz'
        sshPublisher(
          publishers: [
            sshPublisherDesc(
              configName: '192.168.1.30',
              transfers: [
                sshTransfer(
                  cleanRemote: true,
                  excludes: '',
                  execCommand: 'cd /var/www/html/react-boilerplate && rm -rf build && tar xvzf build.tar.gz && rm -f build.tar.gz',
                  execTimeout: 120000,
                  flatten: false,
                  makeEmptyDirs: false,
                  noDefaultExcludes: false,
                  patternSeparator: '[, ]+',
                  remoteDirectory: 'react-boilerplate',
                  remoteDirectorySDF: false,
                  removePrefix: '', sourceFiles: 'build.tar.gz'
                )
              ],
              usePromotionTimestamp: false,
              useWorkspaceInPromotion: false,
              verbose: true
            )
          ]
        )
      }
    }
  }

  post {
    failure {
        mail to: 'quynh.le@hdwebsoft.com',
             subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
             body: "Something is wrong with ${env.BUILD_URL}"
    }
  }
}
