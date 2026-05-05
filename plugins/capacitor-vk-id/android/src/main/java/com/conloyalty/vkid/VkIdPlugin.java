package com.conloyalty.vkid;

import android.app.Activity;
import android.util.Log;

import androidx.lifecycle.LifecycleOwner;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.id.VKID;
import com.vk.id.VKIDAuthFail;
import com.vk.id.AccessToken;
import com.vk.id.auth.VKIDAuthCallback;
import com.vk.id.auth.VKIDAuthParams;
import com.vk.id.auth.AuthCodeData;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";
    private PluginCall savedCall;
    private AccessToken currentToken;

    @PluginMethod
    public void login(PluginCall call) {
        savedCall = call;
        Activity activity = getActivity();

        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        if (!(activity instanceof LifecycleOwner)) {
            call.reject("Activity must implement LifecycleOwner");
            return;
        }

        try {
            VKIDAuthCallback callback = new VKIDAuthCallback() {
                @Override
                public void onAuth(AccessToken accessToken) {
                    currentToken = accessToken;
                    handleSuccess(accessToken);
                }

                @Override
                public void onFail(VKIDAuthFail fail) {
                    handleError(fail);
                }

                @Override
                public void onAuthCode(AuthCodeData authCodeData, boolean isCompletion) {
                    Log.d(TAG, "Auth code received, isCompletion: " + isCompletion);
                }
            };

            VKIDAuthParams params = new VKIDAuthParams.Builder().build();
            VKID.Companion.getInstance().authorize((LifecycleOwner) activity, callback, params);

        } catch (Exception e) {
            Log.e(TAG, "Login error", e);
            call.reject("Login failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void logout(PluginCall call) {
        currentToken = null;
        call.resolve();
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        try {
            if (currentToken == null) {
                call.resolve(new JSObject().put("user", JSObject.NULL));
                return;
            }

            JSObject user = new JSObject();
            user.put("accessToken", currentToken.getToken());

            // Добавляем данные пользователя из токена
            if (currentToken.getUserData() != null) {
                user.put("id", currentToken.getUserData().getUserId());
                user.put("firstName", currentToken.getUserData().getFirstName());
                user.put("lastName", currentToken.getUserData().getLastName());
                user.put("phone", currentToken.getUserData().getPhone());
scheme: Scheme.LIGHT,
        lang: Languages.RUS,
      }) as AuthResponse;

      const tokenResult = await Auth.exchangeCode(
        authResponse.code,
        authResponse.device_id
      );

      localStorage.setItem('vk_token', tokenResult.access_token);
      localStorage.setItem('vk_refresh_token', tokenResult.refresh_token);

      const userInfoResult = await Auth.userInfo(tokenResult.access_token);

      const user: VKUser = {
        id: tokenResult.user_id,
        first_name: userInfoResult.user.first_name || '',
        last_name: userInfoResult.user.last_name || '',
        avatar: userInfoResult.user.avatar,
        phone: userInfoResult.user.phone,
        email: userInfoResult.user.email,
      };

      return user;
    } catch (error) {
      console.error('Web VK ID login error:', error);
      throw new Error('Не удалось войти через VK ID');
    }
  }

  private async getUserInfoFromAPI(accessToken: string): Promise<Partial<VKUser> & { id?: number }> {
    try {
      const params = new URLSearchParams({
        access_token: accessToken,
        fields: 'photo_200,contacts',
        v: '5.131',
      });

      const response = await fetch(`https://api.vk.com/method/users.get?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        console.error('VK API error:', data.error);
        return {};
      }

      const vkUser = data.response[0];
      return {
        id: vkUser.id,
        first_name: vkUser.first_name,
        last_name: vkUser.last_name,
        avatar: vkUser.photo_200,
        phone: vkUser.mobile_phone || vkUser.home_phone,
      };
    } catch (error) {
      console.error('Error fetching user info from VK API:', error);
      return {};
    }
  }

  async logout() {
    const token = localStorage.getItem('vk_token');

    if (this.isNative) {
      await VkId.logout();
    } else if (token) {
      try {
        await Auth.logout(token);
      } catch (error) {
        console.error('VK ID logout error:', error);
      }
    }

    localStorage.removeItem('vk_user');
    localStorage.removeItem('vk_token');
    localStorage.removeItem('vk_refresh_token');
  }
}

export const vkidService = new VKIDService();
