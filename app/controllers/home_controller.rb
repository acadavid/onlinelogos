class HomeController < ApplicationController
  def index
    room_id = SecureRandom.urlsafe_base64(8)
    redirect_to room_path(room_id)
  end

  def room
    @room_id = params[:id]
  end
end
