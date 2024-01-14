pipeline {
  agent {label 'master'}
  //tools {nodejs '18.16.0'}
  options {
    skipStagesAfterUnstable()
    timeout(time: 1, unit: 'HOURS') 
  }
  environment {def server = ''}
  stages {
    stage('清理文件') {
      steps {
        // 初始化参数
        script {
          server = getServer()
        }
        // 在远程主机上删除项目文件
        sshCommand remote: server, command: 'rm -rf /usr/share/nginx/TTMS.Web/dist'
      }
    }
    stage('本地构建') {
      steps {
        // 删除历史构建，重新在本地构建
        nodejs("nodejs"){
          sh 'rm -rf ./dist && pnpm install && pnpm build'
        }
      }
    }
    stage('远程部署') {
      steps {
        // 将构建好的文件部署到远程服务器
        sshPut remote: server, from: "dist", into: "/usr/share/nginx/TTMS.Web"
      }
    }
  }
}


// 定义一个方法，返回ssh连接所需的信息
def getServer() {
    def remote = [:]
    remote.name = "ssh"
    remote.host = "chdxia.com"
    remote.port = 22
    remote.allowAnyHosts = true

    withCredentials([usernamePassword(
        credentialsId: "a94f0f8e-c562-434a-aed7-8e08afa3670b",
        usernameVariable: "username",
        passwordVariable: "password"
    )]) {
        remote.user = "${username}"
        remote.password = "${password}"
    }
    return remote
}
