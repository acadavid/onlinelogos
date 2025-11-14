class ZoomController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:generate_jwt]

  def generate_jwt
    session_name = params[:session_name]
    user_name = params[:user_name] || "User"

    if session_name.blank?
      render json: { error: "session_name is required" }, status: :bad_request
      return
    end

    zoom_config = YAML.load_file(Rails.root.join("config", "zoom.yml"))
    sdk_key = zoom_config["sdk_key"]
    sdk_secret = zoom_config["sdk_secret"]

    if sdk_key.blank? || sdk_secret.blank?
      render json: { error: "Zoom SDK credentials not configured in config/zoom.yml" }, status: :internal_server_error
      return
    end

    iat = Time.now.to_i - 30
    exp = iat + 60 * 60 * 2

    payload = {
      app_key: sdk_key,
      tpc: session_name,
      role_type: 1,
      version: 1,
      iat: iat,
      exp: exp
    }

    token = JWT.encode(payload, sdk_secret, "HS256")

    render json: { signature: token }
  end
end
